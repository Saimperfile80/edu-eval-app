// lib/api/teacher/evaluations.ts
export interface ExamTheme {
  id: string | number;
  title: string;
  category: string;
  duration_minutes: number;
  status: string;
  created_at: string;
  course_name?: string;
}

const API_BASE = 'http://localhost:8000/api';

export const evaluationService = {
  async getEvaluations(): Promise<ExamTheme[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/evaluations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des évaluations');
    }

    return response.json();
  },

  async createEvaluation(data: {
    title: string;
    category: string;
    duration_minutes: number;
    questions?: any[];
    course_id?: number;
  }): Promise<ExamTheme> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/evaluations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création de l\'évaluation');
    }

    return response.json();
  }
};