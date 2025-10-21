const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(message: string, status = 0, body: any = null) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  let body: any = null;
  const text = await res.text();
  try {
    body = text ? JSON.parse(text) : null;
  } catch (e) {
    body = text;
  }

  if (!res.ok) {
    // Special handling for 401 can be done by caller
    throw new ApiError(body?.message || `HTTP error ${res.status}`, res.status, body);
  }

  return body;
}

export const apiClient = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, data: any) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: any) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string) => request(path, { method: 'DELETE' })
};

export default apiClient;
