import { useEffect, useState } from 'react';
import type { Professional } from './FindPro';
import { supabase } from '../lib/supabase';
import ProCard from './ProCard';

interface ProsCarouselProps {
    jobs: string[];
}

function ProsCarousel({ jobs }: ProsCarouselProps) {
    const [pros, setPros] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPros = async () => {
            try {
                setLoading(true);

                const requests = jobs.map(job =>
                    fetch(`/api/professionals?job=${encodeURIComponent(job)}`)
                        .then(res => (res.ok ? res.json() : null))
                );

                const results = await Promise.all(requests);

                const allPros: Professional[] = results
                    .filter(Boolean)
                    .flatMap(result => result.professionals || []);

                const uniquePros = Array.from(
                    new Map(allPros.map(pro => [pro.id, pro])).values()
                );

                uniquePros.sort((a, b) => {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });

                setPros(uniquePros);
            } catch (error) {
                console.error('Error fetching pros', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserAppointments = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;

                await fetch('/api/appointments', {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
            } catch (error) {
                console.error('Error fetching appointments', error);
            }
        };

        if (jobs?.length > 0) fetchPros();
        else { setPros([]); setLoading(false); }

        fetchUserAppointments();
    }, [jobs]);

    return (
        <div>
            {loading ? (
                <p>Loading professionals...</p>
            ) : pros.length === 0 ? (
                <p>No professionals found.</p>
            ) : (
                <div className="space-y-2 flex flex-wrap gap-4">
                    {pros.map(pro => (
                        <ProCard
                            key={pro.id}
                            pro={pro}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProsCarousel;