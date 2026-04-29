import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../../lib/supabase';
import Map from "../../components/Map";

export default function DashboardMaps() {
  //const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [cityFilter, setCityFilter] = useState('Paris');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
          setProfile(data.user);
          if (data.user.details?.city_preference) {
            setCityFilter(data.user.details.city_preference);
          }
        } else {
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

  // --- CORRECTION ICI ---
  // On ne calcule ces variables que si le chargement est fini et que le profile existe
  if (loading) return <div className="p-8 flex justify-center">Loading...</div>;
  if (!profile) return <div className="p-8">Error loading profile.</div>;

  // Maintenant on peut lire profile sans risque
 // const isUserA = profile.role === 'user_reconversion';
 // const hasTestResults = isUserA && profile.details?.test_results && profile.details.test_results.length > 0;
  // ----------------------

  return (
    <div className="h-full w-full">
      {/* <StyledTitle text='Maps' className='text-[1.7rem] pb-5' /> */}

      <Map city={cityFilter} suggestedJobs={profile.details?.test_results || []} />

    </div>
  );
}