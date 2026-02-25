import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X, Phone, Mail, Globe, Clock, MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Toast from './Toast';

// Fix Leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  city?: string;
  showTraining?: boolean;
  showHousing?: boolean;
  showUniversities?: boolean;
  showAlternance?: boolean;
  suggestedJobs?: string[]; // Métiers suggérés par l'IA pour filtrer les établissements
}

interface MarkerData {
  id: string;
  name: string;
  address: string;
  position: { lat: number; lon: number };
  type: 'TRAINING' | 'HOUSING' | 'UNIVERSITY' | 'ALTERNANCE';
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  openingHours?: string;
  description?: string;
  tags: {
    alternance: boolean;
    financed: boolean;
    university: boolean;
    private: boolean;
    adultTraining: boolean;
  };
  source: string;
}

interface EstablishmentModalProps {
  establishment: MarkerData | null;
  onClose: () => void;
  onAddToFavorites: (item: MarkerData) => void;
}

function EstablishmentModal({ establishment, onClose, onAddToFavorites }: EstablishmentModalProps) {
  if (!establishment) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TRAINING': return 'Formation';
      case 'HOUSING': return 'Logement';
      case 'UNIVERSITY': return 'Université';
      case 'ALTERNANCE': return 'Alternance';
      default: return 'Établissement';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{establishment.name}</h2>
            <p className="text-sm text-gray-500">{getTypeLabel(establishment.type)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Adresse */}
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-400 mt-1" size={20} />
            <div>
              <p className="font-semibold">Adresse</p>
              <p className="text-gray-600">{establishment.address || 'Non renseignée'}</p>
            </div>
          </div>

          {/* Horaires */}
          {establishment.openingHours && (
            <div className="flex items-start gap-3">
              <Clock className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="font-semibold">Horaires</p>
                <p className="text-gray-600">{establishment.openingHours}</p>
              </div>
            </div>
          )}

          {/* Contact */}
          {(establishment.contact?.phone || establishment.contact?.email || establishment.contact?.website) && (
            <div>
              <p className="font-semibold mb-2">Contact</p>
              <div className="space-y-2">
                {establishment.contact.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <a href={`tel:${establishment.contact.phone}`} className="hover:text-indigo-600">
                      {establishment.contact.phone}
                    </a>
                  </div>
                )}
                {establishment.contact.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <a href={`mailto:${establishment.contact.email}`} className="hover:text-indigo-600">
                      {establishment.contact.email}
                    </a>
                  </div>
                )}
                {establishment.contact.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={16} />
                    <a
                      href={establishment.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600"
                    >
                      {establishment.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {establishment.description && (
            <div>
              <p className="font-semibold mb-2">Description</p>
              <p className="text-gray-600">{establishment.description}</p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {establishment.tags.financed && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-sm">Financé</span>
            )}
            {establishment.tags.alternance && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-sm">Alternance</span>
            )}
            {establishment.tags.university && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-sm">Université</span>
            )}
            {establishment.tags.private && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-sm">Privé</span>
            )}
            {establishment.tags.adultTraining && (
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-sm">Formation adulte</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={() => onAddToFavorites(establishment)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-sm hover:bg-indigo-700"
            >
              <Star size={16} />
              Ajouter aux favoris
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to center map on markers
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function Map({
  city = 'Paris',
  showTraining = true,
  showHousing = true,
  showUniversities = true,
  showAlternance = true,
  suggestedJobs = []
}: MapProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [center, setCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default Paris
  const [selectedEstablishment, setSelectedEstablishment] = useState<MarkerData | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          city,
          limit: '100',
          training: showTraining.toString(),
          housing: showHousing.toString(),
          universities: showUniversities.toString(),
          alternance: showAlternance.toString(),
        });

        // Add suggested jobs for filtering
        if (suggestedJobs && suggestedJobs.length > 0) {
          suggestedJobs.forEach(job => {
            params.append('jobs', job);
          });
        }

        const res = await fetch(`/api/map/establishments?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          console.log('📊 Establishments fetched:', data.length);
          console.log('📍 Sample establishment:', data[0]);

          const validMarkers = data
            .filter((item: any) => {
              const hasPosition = item.position?.lat && item.position?.lon;
              if (!hasPosition) {
                console.warn('⚠️ Item without position:', item.name);
              }
              return hasPosition;
            })
            .map((item: any) => ({
              ...item,
              type: item.tags?.university
                ? 'UNIVERSITY'
                : item.tags?.alternance
                ? 'ALTERNANCE'
                : item.source === 'crous'
                ? 'HOUSING'
                : 'TRAINING',
            }));

          console.log('✅ Valid markers:', validMarkers.length);
          setMarkers(validMarkers);

          // Update center if we have markers
          if (validMarkers.length > 0) {
            const firstMarker = validMarkers[0];
            console.log('🎯 Setting center to:', firstMarker.position);
            setCenter([firstMarker.position.lat, firstMarker.position.lon]);
          } else {
            console.warn('⚠️ No valid markers found');
          }
        } else {
          console.error('❌ API error:', res.status, res.statusText);
        }
      } catch (e) {
        console.error('❌ Error fetching establishments', e);
      }
    };

    fetchData();
  }, [city, showTraining, showHousing, showUniversities, showAlternance]);

  const addToFavorites = async (item: MarkerData) => {
    try {
      // Get session token from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setToast({ message: 'Vous devez être connecté pour ajouter aux favoris', type: 'error' });
        return;
      }

      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          item_type: item.type.toLowerCase(),
          item_id: item.id,
          item_data: item,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message === 'Already in favorites') {
          setToast({ message: 'Déjà dans vos favoris', type: 'info' });
        } else {
          setToast({ message: 'Ajouté aux favoris !', type: 'success' });
        }
        setSelectedEstablishment(null);
      } else {
        const error = await res.json();
        console.error('Error adding to favorites:', error);
        setToast({ message: 'Erreur lors de l\'ajout aux favoris', type: 'error' });
      }
    } catch (e) {
      console.error(e);
      setToast({ message: 'Erreur lors de l\'ajout aux favoris', type: 'error' });
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'HOUSING': return '#10b981'; // green
      case 'TRAINING': return '#3b82f6'; // blue
      case 'UNIVERSITY': return '#8b5cf6'; // purple
      case 'ALTERNANCE': return '#f59e0b'; // orange
      default: return '#6b7280'; // gray
    }
  };

  return (
    <>
      <div className="h-[600px] w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={center} />
          {markers.map((marker, idx) => {
            const color = getMarkerColor(marker.type);
            const customIcon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            return (
              <Marker
                key={`${marker.type}-${marker.id}-${idx}`}
                position={[marker.position.lat, marker.position.lon]}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-sm mb-1">{marker.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{marker.address}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {marker.tags?.financed && <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded-sm">Financé</span>}
                      {marker.tags?.alternance && <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded-sm">Alternance</span>}
                    </div>
                    <button
                      onClick={() => setSelectedEstablishment(marker)}
                      className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-sm hover:bg-indigo-700 w-full"
                    >
                      Voir les détails
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {selectedEstablishment && (
        <EstablishmentModal
          establishment={selectedEstablishment}
          onClose={() => setSelectedEstablishment(null)}
          onAddToFavorites={addToFavorites}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
