export interface Student {
  id: number;
  username: string;
  email: string;
  course: string;
  total_evaluations: number;
  average_grade: number;
  last_evaluation: string;
}

export interface StudentsStats {
  total_students: number;
  total_courses: number;
  global_average: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

export const studentsService = {
  async getStudents(): Promise<{ students: Student[]; stats: StudentsStats }> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des étudiants');
    }

    return response.json();
  },

  async getStudentDetails(studentId: number): Promise<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await fetch(`${API_BASE}/teacher/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des détails de l\'étudiant');
    }

    return response.json();
  }
};