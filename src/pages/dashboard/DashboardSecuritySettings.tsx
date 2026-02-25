import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import StyledTitle from '../../components/home/StyledTitle';
import InputField from '../../components/dashboard/InputField';

export default function DashboardSecuritySettings() {
    const [passwords, setPasswords] = useState({
        oldPassword: '',
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
            setPasswords({oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erreur lors du changement de mot de passe' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 w-full h-full flex flex-col justify-between ">

            <form onSubmit={handleSubmit} className="h-full w-full flex flex-col justify-between ">
                <StyledTitle text='Sécurité' className='text-[1.7rem] pt-12' />
                <div className='flex gap-4 flex-wrap'>

                    <InputField
                        label="Ancien password"
                        name="oldPassword" 
                        type="password"
                        value={passwords.oldPassword}
                        onChange={handleChange}
                        placeholder="**************"
                        required
                        minLength={6}
                    />


                    <InputField
                        label="Nouveau mot de passe"
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        placeholder="**************"
                        required
                        minLength={6}
                    />

                    <InputField
                        label="Confirmer le mot de passe"
                        name="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        placeholder="**************"
                        required
                        minLength={6}
                    />


                </div>
                <div className='flex flex-row justify-between items-end '>
                    {message && (
                        <div className={`p-3 rounded-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                    <div className='flex w-full justify-end'>
                        <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary disabled:opacity-50"
                    >
                        {saving ? 'Modification...' : 'Modifier le mot de passe'}
                    </button>
                    </div>

                </div>

            </form>
        </div>
    );
}
