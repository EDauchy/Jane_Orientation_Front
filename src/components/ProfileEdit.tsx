import ProfileAvatar from './ProfileAvatar';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import TextArea from './TextArea';

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
    <div className='flex flex-col items-center gap-8'>
      <h2 className="headline-primary">Mes Informations</h2>

      <div className='flex flex-col gap-2 w-full max-w-[30rem]'>
        <ProfileAvatar
          userId={profile.id}
          avatarUrl={profile.avatar_url}
          onUpdated={onUpdate}
        />

        <div>
          <h3 className="headline-small mb-1">Je cherche</h3>
          <div className='flex items-center justify-between'>
            <button className='button-primary'>à m'orienter</button>
            <button className='button-secondary'>à aider ceux qui s'orientent</button>
          </div>
        </div>
      </div>


      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[55rem]">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label='Prènom'
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required />

          <TextInput
            label='Nom'
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required />

        </div>

        <div>

          <TextInput
            label='Date de naissance'
            type="text"
            name="lastName"
            value={formData.birthDate}
            onChange={handleChange}
            required />
        </div>

        <SelectInput
          label="Genre"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Sélectionnez</option>
          <option value="M">Homme</option>
          <option value="F">Femme</option>
          <option value="PREFER_NOT_SAY">Préfère ne pas répondre</option>
        </SelectInput>


        {profile.role === 'user_reconversion' && (
          <TextInput
            label='Ville de préférence'
            type="text"
            name="cityPreference"
            value={formData.cityPreference}
            onChange={handleChange}
            placeholder="Ex: Paris, Lyon..."
            required />
        )}

        {profile.role === 'user_pro' && (
          <>
            <div className="bg-gray-50 border border-gray-300 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <p className="text-gray-600">{profile.details?.profession || 'Non renseignée'}</p>
              <p className="text-xs text-gray-500 mt-1">La profession ne peut pas être modifiée pour éviter les abus.</p>
            </div>

            <TextInput
              label="Années d'expérience"
              type="number"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              min="0"
              placeholder="Ex: 5" />

            <TextArea
              label={`Biographie / Description (${formData.bio.length}/500)`}
              name="description"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Écrivez quelque chose…"
            />

          </>
        )}

        <div className='flex gap-3 w-full justify-end'>
          <button
            type="submit"
            disabled={saving}
            className="button-primary"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="button-secondary"
          >
            Annuller
          </button>
        </div>
      </form>
    </div>
  );
}