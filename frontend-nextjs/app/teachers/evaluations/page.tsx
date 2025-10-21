'use client';

import { useEffect, useState } from 'react';
import { evaluationService, ExamTheme } from '@/lib/api/teacher/evaluations';
export default function TeacherEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<ExamTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const data = await evaluationService.getEvaluations();
      setEvaluations(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des évaluations');
      console.error('Erreur:', err);
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mes Épreuves</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={() => window.location.href = '/teachers/evaluations/create'}
        >
          + Nouvelle Épreuve
        </button>
      </div>
      
      {evaluations.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">Aucune épreuve créée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluations.map(evaluation => (
            <div key={evaluation.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-2">{evaluation.title}</h3>
              <p className="text-gray-600 mb-2">
                {evaluation.course_name || 'Non assigné'}
              </p>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {evaluation.duration_minutes} min
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  evaluation.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : evaluation.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {evaluation.status === 'published' ? 'Publiée' : 
                   evaluation.status === 'draft' ? 'Brouillon' : 'Archivée'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Créée le {new Date(evaluation.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}