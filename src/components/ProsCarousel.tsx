import React, { useEffect, useState } from 'react';
import type { Professional } from './FindPro';
import { supabase } from '../lib/supabase';
import ProCard from './ProCard';

interface ProsCarouselProps {
    jobs: string[];
}

function ProsCarousel({ jobs }: ProsCarouselProps) {
    const [pros, setPros] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPro, setSelectedPro] = useState<string | null>(null);
    const [userAppointments, setUserAppointments] = useState<any[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

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

                const res = await fetch('/api/appointments', {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUserAppointments(data.appointments || []);
                }
            } catch (error) {
                console.error('Error fetching appointments', error);
            } finally {
                setLoadingAppointments(false);
            }
        };

        if (jobs?.length > 0) fetchPros();
        else { setPros([]); setLoading(false); }

        fetchUserAppointments();
    }, [jobs]);

    const handleSelectDate = (proId: string, date: string) => {
        setSelectedPro(proId);
        setSelectedDate(date);
    };

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
                            selectedDate={selectedDate}
                            selectedProId={selectedPro}
                            onSelectDate={handleSelectDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProsCarousel;