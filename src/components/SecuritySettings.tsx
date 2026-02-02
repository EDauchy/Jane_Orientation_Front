import { useState } from 'react';
import { supabase } from '../lib/supabase';
import TextInput from './TextInput';

export default function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setSaving(false);
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors du changement de mot de passe' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='flex flex-col gap-22 items-center'>
      <h2 className="headline-primary">Sécurité</h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 h-full w-full max-w-[30rem]">
        <div className='gap-4 flex flex-col'>
          <TextInput
            label='Nouveau mot de passe'
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            required />

          <TextInput
            label='Confirmer le mot de passe'
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required />
        </div>
        <div className='flex justify-end'>
          <button
            type="submit"
            disabled={saving}
            className="button-primary"
          >
            {saving ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  );
}
