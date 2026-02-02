import { useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MdFileUpload } from "react-icons/md";

interface ProfileAvatarProps {
    userId: string;
    avatarUrl?: string;
    onUpdated: () => void;
}


export default function ProfileAvatar({
    userId,
    avatarUrl,
    onUpdated,
}: ProfileAvatarProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setError(null);
            setUploading(true);

            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                throw new Error('Le fichier doit être une image');
            }

            if (file.size > 2 * 1024 * 1024) {
                throw new Error('Image trop lourde (max 2 Mo)');
            }

            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/avatar.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profiles_pictures')
                .upload(filePath, file, {
                    upsert: true,
                    contentType: file.type,
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('profiles_pictures')
                .getPublicUrl(filePath);

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                throw new Error('Session expirée');
            }

            const res = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ avatarUrl: data.publicUrl }),
            });

            if (!res.ok) {
                throw new Error('Erreur lors de la mise à jour de la photo');
            }

            onUpdated();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 mb-6">
            <img
                src={avatarUrl || '/placeholder-avatar.png'}
                alt="Avatar"
                className="w-16 aspect-square rounded-full object-cover border"
            />

            {/* Hidden input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                hidden
            />

            <div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 flex gap-2 items-center py-2 rounded-lg border-2 border-primary text-primary font-bold uppercase hover:bg-primary hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {uploading ? 'Upload…' : 'Changer la photo'}
                    <MdFileUpload className="text-xl" />
                </button>

                {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
            </div>
        </div>
    );
}
