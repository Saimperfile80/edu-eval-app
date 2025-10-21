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

import { apiClient } from '../../lib/api/client';

export const studentsService = {
  async getStudents(): Promise<{ students: Student[]; stats: StudentsStats }> {
    return apiClient.get('/teacher/students');
  },

  async getStudentDetails(studentId: number): Promise<any> {
    return apiClient.get(`/teacher/students/${studentId}`);
  }
};