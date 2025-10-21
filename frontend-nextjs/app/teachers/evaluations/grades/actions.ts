export interface ExamSession {
  id: number;
  student_name: string;
  student_email: string;
  submitted_at: string;
  answers: any[];
  final_grade?: number;
  status: string;
  exam_title: string;
  exam_theme_id: number;
}

export interface Question {
  numero: number;
  question: string;
  points: number;
  type: string;
}

export interface ExamTheme {
  id: number;
  title: string;
  questions: Question[];
  course_name: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

export const gradingService = {
  async getSessionsToGrade(): Promise<ExamSession[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/grading/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des copies à corriger');
    }

    return response.json();
  },

  async getSessionDetails(sessionId: number): Promise<{
    session: ExamSession;
    exam_theme: ExamTheme;
    student: any;
  }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/grading/session/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des détails de la session');
    }

    return response.json();
  },

  async submitGrade(sessionId: number, data: {
    final_grade: number;
    teacher_comments: string;
    mention: string;
    grades: number[];
    comments: string[];
  }): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/grading/session/${sessionId}/grade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'enregistrement de la correction');
    }

    return response.json();
  }
};