'use client';

import { useEffect, useState } from 'react';

interface Student {
  id: number;
  username: string;
  email: string;
  course: string;
}

interface Evaluation {
  id: number;
  title: string;
  course_name: string;
  max_points: number;
}

interface GradeEntry {
  student_id: number;
  grade: number;
  mention: string;
  comments: string;
}

export default function EnterGradesPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Données simulées
      const mockEvaluations: Evaluation[] = [
        { id: 1, title: 'Contrôle de Mathématiques', course_name: 'Mathématiques', max_points: 20 },
        { id: 2, title: 'Examen de Physique', course_name: 'Physique', max_points: 20 },
        { id: 3, title: 'Test de Français', course_name: 'Français', max_points: 20 }
      ];

      const mockStudents: Student[] = [
        { id: 1, username: 'Jean Dupont', email: 'jean.dupont@email.com', course: 'Mathématiques' },
        { id: 2, username: 'Marie Martin', email: 'marie.martin@email.com', course: 'Mathématiques' },
        { id: 3, username: 'Pierre Lambert', email: 'pierre.lambert@email.com', course: 'Mathématiques' },
        { id: 4, username: 'Sophie Bernard', email: 'sophie.bernard@email.com', course: 'Mathématiques' }
      ];

      setEvaluations(mockEvaluations);
      setStudents(mockStudents);
      
      // Initialiser les notes vides
      const initialGrades: GradeEntry[] = mockStudents.map(student => ({
        student_id: student.id,
        grade: 0,
        mention: '',
        comments: ''
      }));
      setGrades(initialGrades);
      
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluationSelect = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    // Réinitialiser les notes pour la nouvelle évaluation
    const initialGrades: GradeEntry[] = students.map(student => ({
      student_id: student.id,
      grade: 0,
      mention: '',
      comments: ''
    }));
    setGrades(initialGrades);
  };

  const updateGrade = (studentId: number, field: keyof GradeEntry, value: any) => {
    setGrades(prev => prev.map(grade => 
      grade.student_id === studentId 
        ? { ...grade, [field]: value }
        : grade
    ));
  };

  const autoAssignMentions = () => {
    setGrades(prev => prev.map(grade => {
      let mention = '';
      if (grade.grade >= 18) mention = 'Excellent';
      else if (grade.grade >= 16) mention = 'Très bien';
      else if (grade.grade >= 14) mention = 'Bien';
      else if (grade.grade >= 12) mention = 'Assez bien';
      else if (grade.grade >= 10) mention = 'Passable';
      else if (grade.grade > 0) mention = 'Insuffisant';
      
      return { ...grade, mention };
    }));
  };

  const submitGrades = async () => {
    if (!selectedEvaluation) return;

    setSaving(true);
    try {
      // Simulation d'envoi
      console.log('Notes à enregistrer:', {
        evaluation_id: selectedEvaluation.id,
        grades: grades
      });

      alert('Notes enregistrées avec succès!');
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Saisie des Notes
        </h1>
        <p className="text-gray-600">
          Entrez les notes pour vos évaluations
        </p>
      </div>

      {!selectedEvaluation ? (
        /* Sélection de l'évaluation */
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Choisir une évaluation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluations.map(evaluation => (
              <div
                key={evaluation.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => handleEvaluationSelect(evaluation)}
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  {evaluation.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {evaluation.course_name}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {students.length} étudiant(s)
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Interface de saisie des notes */
        <div className="bg-white rounded-lg shadow-md">
          {/* En-tête */}
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedEvaluation.title}
                </h2>
                <p className="text-blue-100">
                  {selectedEvaluation.course_name} • {students.length} étudiants
                </p>
              </div>
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
              >
                ← Changer d'évaluation
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Actions globales */}
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm text-gray-600">
                  Notes sur {selectedEvaluation.max_points} points
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={autoAssignMentions}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                  Auto-mentions
                </button>
                <button
                  onClick={submitGrades}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les notes'}
                </button>
              </div>
            </div>

            {/* Tableau des notes */}
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
                      Note /20
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mention
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commentaire
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => {
                    const gradeEntry = grades.find(g => g.student_id === student.id) || {
                      student_id: student.id,
                      grade: 0,
                      mention: '',
                      comments: ''
                    };

                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {student.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={gradeEntry.grade}
                            onChange={(e) => updateGrade(student.id, 'grade', parseFloat(e.target.value) || 0)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={gradeEntry.mention}
                            onChange={(e) => updateGrade(student.id, 'mention', e.target.value)}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Très bien">Très bien</option>
                            <option value="Bien">Bien</option>
                            <option value="Assez bien">Assez bien</option>
                            <option value="Passable">Passable</option>
                            <option value="Insuffisant">Insuffisant</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={gradeEntry.comments}
                            onChange={(e) => updateGrade(student.id, 'comments', e.target.value)}
                            placeholder="Commentaire..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Statistiques rapides */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {grades.filter(g => g.grade >= 10).length}
                </div>
                <div className="text-sm text-gray-600">Admis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {grades.filter(g => g.grade > 0 && g.grade < 10).length}
                </div>
                <div className="text-sm text-gray-600">Non admis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {grades.filter(g => g.grade === 0).length}
                </div>
                <div className="text-sm text-gray-600">Non notés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {grades.length > 0 
                    ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(1)
                    : '0'
                  }
                </div>
                <div className="text-sm text-gray-600">Moyenne</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}