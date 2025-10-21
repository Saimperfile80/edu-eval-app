import { ExamTheme, Question } from '../actions';

export interface CreateEvaluationData {
  title: string;
  course_id?: number;
  category: string;
  duration_minutes: number;
  instructions?: string;
  questions: Question[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

export const createEvaluationService = {
  async createEvaluation(data: CreateEvaluationData): Promise<ExamTheme> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/evaluations/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de l\'évaluation');
    }

    return response.json();
  },

  async getCourses(): Promise<{ id: number; course_name: string }[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/courses`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des cours');
    }

    return response.json();
  }
};