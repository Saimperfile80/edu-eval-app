'use client';

import { useEffect, useState } from 'react';

interface Student {
  id: number;
  username: string;
  email: string;
  course: string;
  total_evaluations: number;
  average_grade: number;
  last_evaluation: string;
}

export default function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total_students: 0,
    total_courses: 0,
    global_average: 0
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // Données simulées - À remplacer par l'appel API
      const mockStudents: Student[] = [
        {
          id: 1,
          username: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          course: 'Mathématiques',
          total_evaluations: 5,
          average_grade: 14.5,
          last_evaluation: '2024-01-15'
        },
        {
          id: 2,
          username: 'Marie Martin',
          email: 'marie.martin@email.com',
          course: 'Physique',
          total_evaluations: 3,
          average_grade: 16.2,
          last_evaluation: '2024-01-10'
        },
        {
          id: 3,
          username: 'Pierre Lambert',
          email: 'pierre.lambert@email.com',
          course: 'Mathématiques',
          total_evaluations: 4,
          average_grade: 11.8,
          last_evaluation: '2024-01-12'
        }
      ];

      setStudents(mockStudents);
      setStats({
        total_students: mockStudents.length,
        total_courses: new Set(mockStudents.map(s => s.course)).size,
        global_average: mockStudents.reduce((acc, s) => acc + s.average_grade, 0) / mockStudents.length
      });
      
    } catch (err) {
      setError('Erreur lors du chargement des étudiants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Liste des Étudiants</h1>
          <p className="text-gray-600">Gestion et suivi des étudiants</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
          Exporter la liste
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
          <div className="text-3xl font-bold">{stats.total_students}</div>
          <div className="text-blue-100">Étudiants total</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
          <div className="text-3xl font-bold">{stats.total_courses}</div>
          <div className="text-green-100">Cours différents</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
          <div className="text-3xl font-bold">{stats.global_average.toFixed(1)}</div>
          <div className="text-purple-100">Moyenne générale</div>
        </div>
      </div>

      {/* Tableau des étudiants */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Détail par étudiant
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {students.length} étudiant(s)
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Évaluations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière éval.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{student.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {student.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.total_evaluations}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.average_grade >= 10 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.average_grade.toFixed(1)}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(student.last_evaluation).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => window.location.href = `/teachers/students/${student.id}`}
                      >
                        👁️ Voir
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => window.location.href = `/teachers/evaluations?student_id=${student.id}`}
                      >
                        📊 Évals
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">Aucun étudiant trouvé</div>
          </div>
        )}
      </div>

      {/* Pied de page */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </div>
        <button className="text-blue-600 hover:text-blue-800">
          Actualiser la liste
        </button>
      </div>
    </div>
  );
}