import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const QUESTIONS = [
  { id: 'question1', text: "Quel environnement de travail (par exemple, travail en équipe, travail en autonomie, ambiance créative ou structurée) vous permet de vous sentir le plus épanoui(e) et pourquoi ?" },
  { id: 'question2', text: "Quelles activités ou situations vous donnent l’impression d’être pleinement engagé(e) et motivé(e) ? Décrivez ce qui, dans ces contextes, résonne avec vos valeurs profondes." },
  { id: 'question3', text: "Comment réagissez-vous face aux imprévus et aux situations stressantes ? Pouvez-vous donner un exemple où votre manière de gérer l’adversité vous a permis de grandir ou d’apprendre ?" },
  { id: 'question4', text: "Préférez-vous collaborer avec d’autres personnes ou travailler en solo pour atteindre vos objectifs ? Expliquez les raisons qui sous-tendent votre préférence." },
  { id: 'question5', text: "Quels rêves ou ambitions professionnels vous animent depuis toujours ? En quoi ces aspirations reflètent-elles votre personnalité et vos compétences uniques ?" },
  { id: 'question6', text: "Comment intégrez-vous vos passions et vos loisirs dans votre quotidien professionnel ou académique pour maintenir un équilibre harmonieux ?" },
  { id: 'question7', text: "Lorsqu’il s’agit de prendre une décision importante, quelle importance accordez-vous à l’analyse logique versus l’intuition ? Pouvez-vous illustrer avec une situation concrète ?" },
  { id: 'question8', text: "Dans quelle mesure vous sentez-vous à l’aise pour trouver des solutions originales à des problèmes complexes ? Décrivez un moment où votre créativité a fait la différence." },
  { id: 'question9', text: "Quelles sont les valeurs personnelles et professionnelles qui vous semblent non négociables dans votre parcours ? Comment ces valeurs influencent-elles vos choix de vie et de carrière ?" },
  { id: 'question10', text: "Comment accueillez-vous les retours constructifs sur votre travail ou vos actions ? Donnez un exemple où un feedback vous a conduit à une évolution personnelle ou professionnelle significative." },
];

export default function OrientationTest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[] | null>(null);

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if all questions are answered
      const missing = QUESTIONS.filter(q => !answers[q.id] || answers[q.id].trim() === '');
      if (missing.length > 0) {
        throw new Error(`Veuillez répondre à toutes les questions (${missing.length} restantes).`);
      }

      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Vous devez être connecté pour passer le test.');
      }

      const res = await fetch('/api/orientation/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors du test.');
      }

      setResults(data.metiers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vos résultats</h2>
            <p className="text-gray-600 mb-6">
              Basé sur vos réponses, voici les métiers qui semblent le mieux vous correspondre :
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((job, index) => (
                <div key={index} className="border rounded-lg p-4 bg-indigo-50 border-indigo-100">
                  <h3 className="font-medium text-indigo-900">{job}</h3>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Aller au tableau de bord
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm sm:rounded-lg p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Test d'Orientation IA</h2>
            <p className="mt-2 text-gray-600">
              Répondez sincèrement à ces questions pour nous permettre d'analyser votre profil et de vous suggérer des métiers adaptés.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {QUESTIONS.map((q, index) => (
              <div key={q.id} className="space-y-2">
                <label htmlFor={q.id} className="block text-sm font-medium text-gray-900">
                  {index + 1}. {q.text}
                </label>
                <textarea
                  id={q.id}
                  rows={4}
                  className="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="Votre réponse..."
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required
                />
              </div>
            ))}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-xs text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Analyse en cours...' : 'Obtenir mes résultats'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
