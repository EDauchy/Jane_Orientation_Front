import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Phone, Mail, Globe, Trash2, Star } from 'lucide-react';

interface Favorite {
  id: string;
  item_type: string;
  item_id: string;
  item_data: any;
  created_at: string;
}

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const res = await fetch('/api/favorites', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      } else {
        console.error('Error fetching favorites:', res.status);
      }
    } catch (e) {
      console.error('Error fetching favorites:', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setToast({ message: 'Vous devez être connecté', type: 'error' });
        return;
      }

      const res = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (res.ok) {
        setFavorites(favorites.filter(fav => fav.id !== id));
        setToast({ message: 'Favori supprimé', type: 'success' });
        // Auto-hide toast after 2 seconds
        setTimeout(() => setToast(null), 2000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error deleting favorite:', res.status, errorData);
        setToast({ message: 'Erreur lors de la suppression', type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (e) {
      console.error('Error deleting favorite:', e);
      setToast({ message: 'Erreur lors de la suppression', type: 'error' });
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'housing': return 'Logement';
      case 'training': return 'Formation';
      case 'university': return 'Université';
      case 'alternance': return 'Alternance';
      default: return 'Établissement';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'housing': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'university': return 'bg-purple-100 text-purple-800';
      case 'alternance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Vos Favoris</h2>
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="text-yellow-500" size={24} />
          Vos Favoris
        </h2>
        <p className="text-gray-500">Vous n'avez pas encore de favoris. Ajoutez des établissements depuis la carte !</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="text-yellow-500" size={24} />
          Vos Favoris ({favorites.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => {
            const data = favorite.item_data;
            return (
              <div key={favorite.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{data.name || 'Établissement'}</h3>
                    <span className={`text-xs px-2 py-1 rounded-sm ${getTypeColor(favorite.item_type)}`}>
                      {getTypeLabel(favorite.item_type)}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteFavorite(favorite.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Supprimer des favoris"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {data.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{data.address}</span>
                  </div>
                )}

                {data.contact && (
                  <div className="space-y-1 text-sm text-gray-600">
                    {data.contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <a href={`tel:${data.contact.phone}`} className="hover:text-indigo-600">
                          {data.contact.phone}
                        </a>
                      </div>
                    )}
                    {data.contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <a href={`mailto:${data.contact.email}`} className="hover:text-indigo-600 truncate">
                          {data.contact.email}
                        </a>
                      </div>
                    )}
                    {data.contact.website && (
                      <div className="flex items-center gap-2">
                        <Globe size={14} />
                        <a
                          href={data.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-indigo-600 truncate"
                        >
                          Site web
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {data.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {data.tags.financed && (
                      <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded-sm">Financé</span>
                    )}
                    {data.tags.alternance && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded-sm">Alternance</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
