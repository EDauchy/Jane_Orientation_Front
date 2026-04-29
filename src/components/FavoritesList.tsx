import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Mail, Trash2, ChevronLeft, ChevronRight, Plus, ArrowUpRight } from 'lucide-react';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (e) {
      console.error('Error fetching favorites:', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;

      const res = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });

      if (res.ok) {
        setFavorites(favorites.filter(fav => fav.id !== id));
        setToast({ message: 'Favori supprimé', type: 'success' });
        setTimeout(() => setToast(null), 2000);
      } else {
        setToast({ message: 'Erreur lors de la suppression', type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (e) {
      console.error('Error deleting favorite:', e);
      setToast({ message: 'Erreur lors de la suppression', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -220 : 220,
      behavior: 'smooth',
    });
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

  if (loading) return <p className="text-gray-400 text-sm">Chargement des favoris...</p>;

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold uppercase text-primary">
          Mes {getTypeLabel(favorites[0]?.item_type || '')}s favoris
        </h2>

        <div className="relative">
          {/* Flèche gauche */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/60 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-4 h-4 text-primary" />
          </button>

          {/* Slider */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth py-2 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {favorites.map((favorite) => {
              const data = favorite.item_data;
              return (
                <div
                  key={favorite.id}
                  className="relative bg-white rounded-2xl shadow-md p-4 pb-3 min-w-[200px] max-w-[200px] flex flex-col justify-between flex-shrink-0 group"
                >
                  {/* Favori bookmark */}
                  <button
                    onClick={(e) => deleteFavorite(e, favorite.id)}
                    className="absolute -top-1 right-5"
                    title="Retirer des favoris"
                  >
                    <svg width="20" height="26" viewBox="0 0 20 26" fill="currentColor" className="text-primary hover:text-red-500 transition-colors">
                      <path d="M0 0h20v26l-10-7-10 7V0z" />
                    </svg>
                  </button>

                  {/* Contenu */}
                  <div className="flex flex-col gap-1.5 mt-4">
                    <h3 className="font-extrabold text-primary text-sm leading-tight uppercase">
                      {data.name || 'Établissement'}
                    </h3>

                    {data.address && (
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-[10px] text-gray-500 leading-tight line-clamp-2 uppercase">
                          {data.address}
                        </span>
                      </div>
                    )}

                    {data.contact?.email && (
                      <a href={`mailto:${data.contact.email}`} className="self-start">
                        <Mail className="w-4 h-4 text-primary" />
                      </a>
                    )}
                  </div>

                  {/* Flèche en bas à droite */}
                  <div className="self-end mt-2 w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              );
            })}

            {/* Bouton Ajouter */}
            <div
              onClick={() => navigate('/mydashboard/maps')}
              className="bg-primary rounded-2xl py-3 shadow-md min-w-[180px] max-w-[180px] flex flex-col items-center justify-center gap-2 flex-shrink-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="text-white font-extrabold text-xl uppercase">Ajouter</span>
              <Plus className="w-10 h-10 text-white stroke-[3]" />
            </div>
          </div>

          {/* Flèche droite */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/60 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          >
            <ChevronRight className="w-4 h-4 text-primary" />
          </button>
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