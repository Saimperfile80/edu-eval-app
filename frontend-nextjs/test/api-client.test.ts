import { describe, it, expect, vi } from 'vitest';
import { apiClient, ApiError } from '../lib/api/client';

describe('apiClient', () => {
  it('parses JSON response correctly', async () => {
    const mockJson = { hello: 'world' };
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(mockJson)) }));

    const res = await apiClient.get('/test');
    expect(res).toEqual(mockJson);
  });

  it('throws ApiError on non-ok', async () => {
    // @ts-ignore
    global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) }));

    await expect(apiClient.get('/private')).rejects.toThrow(ApiError);
  });
});
