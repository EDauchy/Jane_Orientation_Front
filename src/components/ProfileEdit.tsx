import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ProfileEditProps {
  profile: any;
  onUpdate: () => void;
}

export default function ProfileEdit({ profile, onUpdate }: ProfileEditProps) {
  const [formData, setFormData] = useState({
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    birthDate: profile.birth_date || '',
    gender: profile.gender || '',
    cityPreference: profile.details?.city_preference || '',
    bio: profile.details?.bio || '',
    yearsExperience: profile.details?.years_experience || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setMessage({ type: 'error', text: 'Session expirée. Veuillez vous reconnecter.' });
        return;
      }

      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          gender: formData.gender,
          cityPreference: profile.role === 'user_reconversion' ? formData.cityPreference : undefined,
          bio: profile.role === 'user_pro' ? formData.bio : undefined,
          yearsExperience: profile.role === 'user_pro' && formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      onUpdate();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Mes Informations</h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Sélectionnez</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
            <option value="PREFER_NOT_SAY">Préfère ne pas répondre</option>
          </select>
        </div>

        {profile.role === 'user_reconversion' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville de préférence</label>
            <input
              type="text"
              name="cityPreference"
              value={formData.cityPreference}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ex: Paris, Lyon..."
            />
          </div>
        )}

        {profile.role === 'user_pro' && (
          <>
            <div className="bg-gray-50 p-4 rounded">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <p className="text-gray-600">{profile.details?.profession || 'Non renseignée'}</p>
              <p className="text-xs text-gray-500 mt-1">La profession ne peut pas être modifiée pour éviter les abus.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
              <input
                type="number"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ex: 5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biographie / Description ({formData.bio.length}/500)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                placeholder="Décrivez votre parcours, vos compétences, votre approche..."
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
