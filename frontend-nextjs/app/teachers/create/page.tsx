'use client';

import { useState } from 'react';

interface Question {
  numero: number;
  question: string;
  points: number;
  type: string;
}

interface Course {
  id: number;
  course_name: string;
}

export default function CreateEvaluationPage() {
  const [formData, setFormData] = useState({
    title: '',
    course_id: '',
    category: 'scientifique',
    duration_minutes: 60,
    instructions: '',
    max_points: 20
  });

  const [questions, setQuestions] = useState<Question[]>([
    { numero: 1, question: '', points: 1, type: 'text' }
  ]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les cours au montage
  useState(() => {
    // Simuler le chargement des cours
    setCourses([
      { id: 1, course_name: 'Mathématiques' },
      { id: 2, course_name: 'Physique' },
      { id: 3, course_name: 'Français' }
    ]);
  });

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        numero: questions.length + 1, 
        question: '', 
        points: 1, 
        type: 'text' 
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, numero: i + 1 }));
      setQuestions(newQuestions);
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire');
      setLoading(false);
      return;
    }

    if (questions.some(q => !q.question.trim())) {
      setError('Toutes les questions doivent avoir un contenu');
      setLoading(false);
      return;
    }

    try {
      // Simulation d'envoi - À remplacer par l'appel API réel
      console.log('Données à envoyer:', {
        ...formData,
        questions: questions
      });

      // Redirection temporaire - À remplacer par la navigation réelle
      alert('Épreuve créée avec succès!');
      window.location.href = '/teachers/evaluations';
      
    } catch (err) {
      setError('Erreur lors de la création de l\'épreuve');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Créer une Nouvelle Épreuve
        </h1>
        <p className="text-gray-600">
          Remplissez les informations pour créer une nouvelle évaluation
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de l'épreuve *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Contrôle de Mathématiques - Chapitre 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cours
            </label>
            <select
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un cours</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="scientifique">Scientifique</option>
              <option value="litteraire">Littéraire</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée (minutes) *
            </label>
            <input
              type="number"
              required
              min="5"
              max="300"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions générales
          </label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Consignes pour les étudiants..."
          />
        </div>

        {/* Questions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <span className="mr-2">+</span> Ajouter une question
            </button>
          </div>

          {questions.map((question, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Question {question.numero}</h4>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    ✕ Supprimer
                  </button>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question *
                </label>
                <textarea
                  required
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Énoncé de la question..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={question.points}
                    onChange={(e) => updateQuestion(index, 'points', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de réponse
                  </label>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Réponse texte</option>
                    <option value="choice">Choix multiples</option>
                    <option value="calculation">Calcul</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={() => window.location.href = '/teachers/evaluations'}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => alert('Génération PDF - Fonction à implémenter')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Générer PDF
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer l\'Épreuve'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}