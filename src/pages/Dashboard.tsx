import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SchoolMap from '../components/Map';
import FindPro from '../components/FindPro';
import ProfileEdit from '../components/ProfileEdit';
import SecuritySettings from '../components/SecuritySettings';
import ProDashboard from '../components/ProDashboard';
import FavoritesList from '../components/FavoritesList';
import Toast from '../components/Toast';
import ProsCarousel from '../components/ProsCarousel';
import Appointments from '../appointments/components/index';
import { User, MapPin, Briefcase, Calendar, Settings, LogOut, Search, Navigation } from 'lucide-react';

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [_refreshKey, setRefreshKey] = useState(0);
  const [cityFilter, setCityFilter] = useState('Paris');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get session from Supabase client
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
          navigate('/login');
          return;
        }

        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          console.log('=== API Response ===', data);
          console.log('Profile:', data.user);
          console.log('Details:', data.user?.details);
          console.log('Test Results:', data.user?.details?.test_results);
          setProfile(data.user);
          if (data.user.details?.city_preference) {
            setCityFilter(data.user.details.city_preference);
          }
        } else {
          console.error('API Error:', res.status, await res.text());
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching profile', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="p-8 flex justify-center">Loading...</div>;
  if (!profile) return <div className="p-8">Error loading profile.</div>;

  const isUserA = profile.role === 'user_reconversion';
  const hasTestResults = isUserA && profile.details?.test_results && profile.details.test_results.length > 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {isUserA ? (
              <>
                {!hasTestResults ? (
                  <div className="bg-white shadow-sm rounded-lg p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900">Bienvenue !</h3>
                    <p className="mt-2 text-gray-500">Commencez par passer le test d'orientation.</p>
                    <button
                      onClick={() => navigate('/test')}
                      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Commencer le test
                    </button>
                  </div>
                ) : (
                  <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Vos résultats</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {profile.details.test_results.map((job: string, idx: number) => (
                        <div key={idx} className="border rounded-sm p-4 bg-indigo-50 text-indigo-900 font-medium flex flex-col justify-between">
                          <span className="mb-2">{job}</span>
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-sm hover:bg-indigo-200"
                          >
                            Trouver un pro
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Favorites Section */}
                <FavoritesList />
              </>
            ) : (
              <ProDashboard profile={profile} />
            )}
          </div>
        );
      case 'appointments':
        return (
          <div className='flex flex-col gap-8'>
            <h2 className="headline-primary">Dashboard</h2>
            <div className='flex flex-col gap-5 w-full max-w-2xl h-[500px]'>
              <h3 className='text-2xl font-bold uppercase text-primary'>Mes RDV</h3>
              <Appointments variant="list" />
            </div>
            <div className='w-full bg-secondary h-1 opacity-[0.4] rounded-full'></div>
            <div className='flex flex-col gap-5 w-full max-w-2xl h-full max-h-[600px]'>
              <h3 className='text-2xl font-bold uppercase text-primary'>Demander un Rendez-vous</h3>
              <ProsCarousel jobs={profile.details.test_results} />
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="space-y-4">
            <div className="bg-white shadow-sm rounded-lg p-4">
              <div className="flex gap-4 items-center">
                <label className="font-medium">Ville :</label>
                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && cityFilter.trim()) {
                          setCityFilter(cityFilter.trim());
                        }
                      }}
                      placeholder="Entrez une ville..."
                      className="border rounded-sm px-2 py-1 pl-8 w-full"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          async (position) => {
                            const { latitude, longitude } = position.coords;
                            // Reverse geocoding to get city name
                            try {
                              const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                              );
                              const data = await response.json();
                              const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality;
                              if (city) {
                                setCityFilter(city);
                              } else {
                                setToast({ message: 'Impossible de déterminer la ville depuis votre position', type: 'error' });
                                setTimeout(() => setToast(null), 3000);
                              }
                            } catch (e) {
                              console.error('Geocoding error:', e);
                              setToast({ message: 'Erreur lors de la géolocalisation', type: 'error' });
                              setTimeout(() => setToast(null), 3000);
                            }
                          },
                          (error) => {
                            console.error('Geolocation error:', error);
                            setToast({ message: 'Impossible d\'accéder à votre position. Vérifiez les permissions de géolocalisation.', type: 'error' });
                            setTimeout(() => setToast(null), 3000);
                          }
                        );
                      } else {
                        setToast({ message: 'La géolocalisation n\'est pas supportée par votre navigateur', type: 'error' });
                        setTimeout(() => setToast(null), 3000);
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-1 rounded-sm hover:bg-green-700 flex items-center gap-2"
                    title="Utiliser ma position"
                  >
                    <Navigation size={18} />
                    Ma position
                  </button>
                </div>
              </div>
            </div>
            {hasTestResults ? (
              <SchoolMap city={cityFilter} suggestedJobs={profile.details?.test_results || []} />
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Carte verrouillée 🔒</h3>
                <p className="text-gray-500 mb-4">Vous devez d'abord passer le test d'orientation pour voir les établissements correspondant à vos métiers suggérés.</p>
                <button
                  onClick={() => navigate('/test')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Passer le test d'orientation
                </button>
              </div>
            )}
          </div>
        );
      case 'profile':
        return <ProfileEdit profile={profile} onUpdate={() => setRefreshKey(prev => prev + 1)} />;
      case 'password':
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">Jane</h1>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}`}
          >
            <Briefcase className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${activeTab === 'appointments' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Rendez-vous
          </button>
          {isUserA && (
            <button
              onClick={() => {
                if (!hasTestResults) {
                  setToast({ message: 'Vous devez d\'abord passer le test d\'orientation pour accéder à la carte', type: 'info' });
                  setTimeout(() => setToast(null), 3000);
                  return;
                }
                setActiveTab('map');
              }}
              disabled={!hasTestResults}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${activeTab === 'map' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                } ${!hasTestResults ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={!hasTestResults ? 'Passez d\'abord le test d\'orientation' : ''}
            >
              <MapPin className="w-5 h-5 mr-3" />
              Carte {!hasTestResults && '🔒'}
            </button>
          )}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}`}
          >
            <User className="w-5 h-5 mr-3" />
            Mes Infos
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${activeTab === 'password' ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''}`}
          >
            <Settings className="w-5 h-5 mr-3" />
            Sécurité
          </button>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 mt-auto"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Modals */}
      {selectedJob && (
        <FindPro job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
