'use client';

import { useEffect, useState } from 'react';

interface ExamSession {
  id: number;
  student_name: string;
  student_email: string;
  submitted_at: string;
  answers: any[];
  final_grade?: number;
  status: string;
}

interface Question {
  numero: number;
  question: string;
  points: number;
  type: string;
}

interface ExamTheme {
  id: number;
  title: string;
  questions: Question[];
  course_name: string;
}

export default function GradeEvaluationPage() {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null);
  const [examTheme, setExamTheme] = useState<ExamTheme | null>(null);
  const [grades, setGrades] = useState<number[]>([]);
  const [comments, setComments] = useState<string[]>([]);
  const [finalGrade, setFinalGrade] = useState(0);
  const [mention, setMention] = useState('');
  const [teacherComments, setTeacherComments] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessionsToGrade();
  }, []);

  const loadSessionsToGrade = async () => {
    try {
      setLoading(true);
      // Données simulées
      const mockSessions: ExamSession[] = [
        {
          id: 1,
          student_name: 'Jean Dupont',
          student_email: 'jean.dupont@email.com',
          submitted_at: '2024-01-15T14:30:00',
          answers: [
            "La réponse de l'étudiant à la question 1...",
            "Réponse à la question 2...",
            "Calcul pour la question 3..."
          ],
          status: 'submitted'
        },
        {
          id: 2,
          student_name: 'Marie Martin',
          student_email: 'marie.martin@email.com',
          submitted_at: '2024-01-14T10:15:00',
          answers: [
            "Autre réponse question 1",
            "Réponse différente question 2",
            "Autre calcul question 3"
          ],
          status: 'submitted'
        }
      ];

      const mockExamTheme: ExamTheme = {
        id: 1,
        title: 'Contrôle de Mathématiques - Algèbre',
        course_name: 'Mathématiques',
        questions: [
          { numero: 1, question: "Résolvez l'équation: 2x + 5 = 15", points: 4, type: 'calculation' },
          { numero: 2, question: "Expliquez le théorème de Pythagore", points: 6, type: 'text' },
          { numero: 3, question: "Calculez la dérivée de f(x) = 3x² + 2x", points: 4, type: 'calculation' }
        ]
      };

      setSessions(mockSessions);
      setExamTheme(mockExamTheme);
      setGrades(new Array(mockExamTheme.questions.length).fill(0));
      setComments(new Array(mockExamTheme.questions.length).fill(''));
      
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSession = (session: ExamSession) => {
    setSelectedSession(session);
    // Réinitialiser les notes et commentaires
    setGrades(new Array(examTheme?.questions.length || 0).fill(0));
    setComments(new Array(examTheme?.questions.length || 0).fill(''));
    setFinalGrade(0);
    setMention('');
    setTeacherComments('');
  };

  const updateGrade = (index: number, grade: number) => {
    const newGrades = [...grades];
    newGrades[index] = grade;
    setGrades(newGrades);
    
    // Calcul automatique de la note finale
    const totalPoints = newGrades.reduce((sum, grade) => sum + grade, 0);
    const maxPoints = examTheme?.questions.reduce((sum, q) => sum + q.points, 0) || 1;
    const calculatedGrade = (totalPoints * 20) / maxPoints;
    setFinalGrade(parseFloat(calculatedGrade.toFixed(1)));

    // Attribution automatique de la mention
    if (calculatedGrade >= 18) setMention('Excellent');
    else if (calculatedGrade >= 16) setMention('Très bien');
    else if (calculatedGrade >= 14) setMention('Bien');
    else if (calculatedGrade >= 12) setMention('Assez bien');
    else if (calculatedGrade >= 10) setMention('Passable');
    else if (calculatedGrade > 0) setMention('Insuffisant');
  };

  const updateComment = (index: number, comment: string) => {
    const newComments = [...comments];
    newComments[index] = comment;
    setComments(newComments);
  };

  const submitGrading = async () => {
    if (!selectedSession) return;

    try {
      // Simulation d'envoi
      console.log('Correction soumise:', {
        sessionId: selectedSession.id,
        grades,
        comments,
        finalGrade,
        mention,
        teacherComments
      });

      alert('Correction enregistrée avec succès!');
      
      // Retour à la liste
      setSelectedSession(null);
      loadSessionsToGrade();
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
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
          Correction d'Épreuves
        </h1>
        <p className="text-gray-600">
          Corriger les copies soumises par les étudiants
        </p>
      </div>

      {!selectedSession ? (
        /* Liste des copies à corriger */
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">
              Copies à corriger ({sessions.length})
            </h2>
          </div>

          <div className="p-6">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune copie à corriger pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => selectSession(session)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {session.student_name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {session.student_email}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Soumis le {new Date(session.submitted_at).toLocaleDateString('fr-FR')} à{' '}
                          {new Date(session.submitted_at).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        En attente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Interface de correction */
        <div className="bg-white rounded-lg shadow-md">
          {/* En-tête de la copie */}
          <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Correction de {selectedSession.student_name}
                </h2>
                <p className="text-green-100">
                  {examTheme?.title} • {examTheme?.course_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded text-sm"
              >
                ← Retour à la liste
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Questions et réponses */}
            {examTheme?.questions.map((question, index) => (
              <div key={index} className="mb-6 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">
                    Question {question.numero}
                  </h3>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {question.points} point(s)
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">
                    {question.question}
                  </p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-3">
                    <strong className="text-gray-700">Réponse de l'étudiant:</strong>
                    <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                      {selectedSession.answers[index] || 'Aucune réponse'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note /{question.points}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={question.points}
                      step="0.5"
                      value={grades[index]}
                      onChange={(e) => updateGrade(index, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaire
                    </label>
                    <input
                      type="text"
                      value={comments[index]}
                      onChange={(e) => updateComment(index, e.target.value)}
                      placeholder="Commentaire optionnel..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Résumé et note finale */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Résumé de la correction</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-100 mb-2">
                    Note finale /20
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={finalGrade}
                    onChange={(e) => setFinalGrade(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-purple-700 border border-purple-400 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-100 mb-2">
                    Mention
                  </label>
                  <select
                    value={mention}
                    onChange={(e) => setMention(e.target.value)}
                    className="w-full px-3 py-2 bg-purple-700 border border-purple-400 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Très bien">Très bien</option>
                    <option value="Bien">Bien</option>
                    <option value="Assez bien">Assez bien</option>
                    <option value="Passable">Passable</option>
                    <option value="Insuffisant">Insuffisant</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-100 mb-2">
                    Total points: {grades.reduce((sum, grade) => sum + grade, 0).toFixed(1)}/
                    {examTheme?.questions.reduce((sum, q) => sum + q.points, 0)}
                  </label>
                  <div className="text-purple-200 text-sm">
                    Note calculée: {finalGrade}/20
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-purple-100 mb-2">
                  Commentaire général
                </label>
                <textarea
                  value={teacherComments}
                  onChange={(e) => setTeacherComments(e.target.value)}
                  rows={2}
                  placeholder="Commentaires généraux sur la copie..."
                  className="w-full px-3 py-2 bg-purple-700 border border-purple-400 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="flex justify-end">
              <button
                onClick={submitGrading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                ✓ Valider la Correction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}