import { apiClient } from '../client';

export interface ExamTheme {
  id: string | number;
  title: string;
  category: string;
  duration_minutes: number;
  status: string;
  created_at: string;
  course_name?: string;
}

export const evaluationService = {
  async getEvaluations(): Promise<ExamTheme[]> {
    return apiClient.get('/teacher/evaluations');
  },

  async createEvaluation(data: {
    title: string;
    category: string;
    duration_minutes: number;
    questions?: any[];
    course_id?: number;
  }): Promise<ExamTheme> {
    return apiClient.post('/teacher/evaluations', data);
  }
};