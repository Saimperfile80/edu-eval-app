'use client';

import { useEffect, useState } from 'react';

interface Grade {
  id: number;
  evaluation_title: string;
  course_name: string;
  grade: number;
  mention: string;
  teacher_comments: string;
  evaluated_at: string;
}

interface UpcomingEvaluation {
  id: number;
  title: string;
  course_name: string;
  duration_minutes: number;
  deadline: string;
  status: string;
}

interface StudentStats {
  average_grade: number;
  total_evaluations: number;
  passed_count: number;
  upcoming_count: number;
}

export default function StudentDashboardPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [upcomingEvals, setUpcomingEvals] = useState<UpcomingEvaluation[]>([]);
  const [stats, setStats] = useState<StudentStats>({
    average_grade: 0,
    total_evaluations: 0,
    passed_count: 0,
    upcoming_count: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Données simulées
      const mockGrades: Grade[] = [
        {
          id: 1,
          evaluation_title: 'Contrôle de Mathématiques',
          course_name: 'Mathématiques',
          grade: 16.5,
          mention: 'Très bien',
          teacher_comments: 'Excellent travail, continuez ainsi!',
          evaluated_at: '2024-01-15'
        },
        {
          id: 2,
          evaluation_title: 'Examen de Physique',
          course_name: 'Physique',
          grade: 14.0,
          mention: 'Bien',
          teacher_comments: 'Bon effort, quelques erreurs de calcul',
          evaluated_at: '2024-01-10'
        },
        {
          id: 3,
          evaluation_title: 'Test de Français',
          course_name: 'Français',
          grade: 12.5,
          mention: 'Assez bien',
          teacher_comments: 'Satisfaisant, peut mieux faire',
          evaluated_at: '2024-01-08'
        }
      ];

      const mockUpcoming: UpcomingEvaluation[] = [
        {
          id: 1,
          title: 'Contrôle de Chimie',
          course_name: 'Chimie',
          duration_minutes: 90,
          deadline: '2024-01-20T14:00:00',
          status: 'available'
        },
        {
          id: 2,
          title: 'Devoir de Philosophie',
          course_name: 'Philosophie',
          duration_minutes: 60,
          deadline: '2024-01-22T10:00:00',
          status: 'available'
        }
      ];

      const mockStats: StudentStats = {
        average_grade: 14.3,
        total_evaluations: 3,
        passed_count: 3,
        upcoming_count: 2
      };

      setGrades(mockGrades);
      setUpcomingEvals(mockUpcoming);
      setStats(mockStats);
      
    } catch (error) {
      console.error('Erreur:', error);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Tableau de Bord Étudiant
        </h1>
        <p className="text-gray-600">
          Bienvenue sur votre espace personnel de suivi académique
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
          <div className="text-3xl font-bold">{stats.average_grade.toFixed(1)}</div>
          <div className="text-blue-100">Moyenne générale</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
          <div className="text-3xl font-bold">{stats.total_evaluations}</div>
          <div className="text-green-100">Évaluations passées</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
          <div className="text-3xl font-bold">{stats.passed_count}</div>
          <div className="text-purple-100">Évaluations réussies</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6 text-center">
          <div className="text-3xl font-bold">{stats.upcoming_count}</div>
          <div className="text-orange-100">À venir</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dernières notes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Dernières Notes</h2>
          </div>
          
          <div className="p-6">
            {grades.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune note pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {grades.map((grade) => (
                  <div key={grade.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {grade.evaluation_title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {grade.course_name}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        grade.grade >= 16 ? 'bg-green-100 text-green-800' :
                        grade.grade >= 14 ? 'bg-blue-100 text-blue-800' :
                        grade.grade >= 12 ? 'bg-yellow-100 text-yellow-800' :
                        grade.grade >= 10 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {grade.grade}/20
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Mention: <strong>{grade.mention}</strong>
                      </span>
                      <span className="text-gray-500">
                        {new Date(grade.evaluated_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {grade.teacher_comments && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                        {grade.teacher_comments}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => window.location.href = '/students/grades'}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir toutes mes notes →
              </button>
            </div>
          </div>
        </div>

        {/* Évaluations à venir */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-orange-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Évaluations à Venir</h2>
          </div>
          
          <div className="p-6">
            {upcomingEvals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune évaluation à venir
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvals.map((evalItem) => (
                  <div key={evalItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {evalItem.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {evalItem.course_name}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {evalItem.duration_minutes} min
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        ⏰ {new Date(evalItem.deadline).toLocaleDateString('fr-FR')}
                      </span>
                      <button 
                        onClick={() => window.location.href = `/students/evaluations/take/${evalItem.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Commencer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => window.location.href = '/students/evaluations'}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir toutes les évaluations →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/students/evaluations'}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-center transition duration-200"
          >
            <div className="text-lg font-semibold">📝</div>
            <div>Mes Évaluations</div>
          </button>
          
          <button 
            onClick={() => window.location.href = '/students/grades'}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-center transition duration-200"
          >
            <div className="text-lg font-semibold">📊</div>
            <div>Mes Notes</div>
          </button>
          
          <button 
            onClick={() => window.location.href = '/students/complaints'}
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg text-center transition duration-200"
          >
            <div className="text-lg font-semibold">⚠️</div>
            <div>Réclamations</div>
          </button>
        </div>
      </div>
    </div>
  );
}