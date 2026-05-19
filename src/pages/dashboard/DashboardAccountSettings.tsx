// pages/dashboard/DashboardAccountSettings.tsx
import { useEffect, useState } from 'react';
import PageLoader from '../../components/ui/PageLoader';
import { supabase } from '../../lib/supabase';
import { useDashboard } from '../../context/DashboardContext';
import ProfileAvatar from '../../components/ProfileAvatar';
import TextInput from '../../components/TextInput';
import SelectInput from '../../components/SelectInput';
import TextArea from '../../components/TextArea';
import StyledTitle from '../../components/home/StyledTitle';
import { User } from 'lucide-react';

export default function DashboardAccountSettings() {
  const { profile, loading, refreshProfile } = useDashboard();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    cityPreference: '',
    bio: '',
    yearsExperience: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync formData quand profile arrive ou change
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        birthDate: profile.birth_date || '',
        gender: profile.gender || '',
        cityPreference: profile.details?.city_preference || '',
        bio: profile.details?.bio || '',
        yearsExperience: profile.details?.years_experience || '',
      });
    }
  }, [profile]);

  // Early returns APRÈS tous les hooks
  if (loading) return <PageLoader />;
  if (!profile) return <div className="p-8">Erreur de chargement du profil.</div>;

  const isUserA = profile.role === 'user_reconversion';
  const isPro = profile.role === 'user_pro';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
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
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          gender: formData.gender,
          cityPreference: isUserA ? formData.cityPreference : undefined,
          bio: isPro ? formData.bio : undefined,
          yearsExperience: isPro && formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la mise à jour du profil');

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      refreshProfile();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      birthDate: profile.birth_date || '',
      gender: profile.gender || '',
      cityPreference: profile.details?.city_preference || '',
      bio: profile.details?.bio || '',
      yearsExperience: profile.details?.years_experience || '',
    });
    setMessage(null);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <StyledTitle text='mon compte' className='text-[1.7rem] pt-1' />

      {/* Avatar + Role toggle */}
      <div className="flex flex-col gap-2 w-full max-w-[30rem]">
     {profile.avatar_url ? (
  <ProfileAvatar
    userId={profile.id}
    avatarUrl={profile.avatar_url}
    onUpdated={refreshProfile}
  />
) : (
  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto">
    <User className="w-12 h-12 text-primary/40" />
  </div>
)}

    
      </div>

      {/* Feedback message */}
      {message && (
        <div
          className={`w-full max-w-[55rem] p-3 rounded transition-opacity ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[55rem]">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Prénom"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Nom"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <TextInput
          label="Date de naissance"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />

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

        {isUserA && (
          <TextInput
            label="Ville de préférence"
            type="text"
            name="cityPreference"
            value={formData.cityPreference}
            onChange={handleChange}
            placeholder="Ex: Paris, Lyon..."
            required
          />
        )}

        {isPro && (
          <>
            <div className="bg-gray-50 border border-gray-300 p-4 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <p className="text-gray-600">{profile.details?.profession || 'Non renseignée'}</p>
              <p className="text-xs text-gray-500 mt-1">
                La profession ne peut pas être modifiée pour éviter les abus.
              </p>
            </div>

            <TextInput
              label="Années d'expérience"
              type="number"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              min="0"
              placeholder="Ex: 5"
            />

            <TextArea
              label={`Biographie / Description (${formData.bio.length}/500)`}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              placeholder="Écrivez quelque chose…"
            />
          </>
        )}

        <div className="flex gap-3 w-full justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-4 py-2 text-sm rounded-xl font-semibold uppercase hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 rounded-xl border-2 text-sm border-primary text-primary font-bold uppercase hover:bg-primary hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}