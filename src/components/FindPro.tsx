import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { supabase } from '../lib/supabase';
import AvailableDatePicker from '../appointments/components/AvailableDatePicker';
import Toast from './Toast';
import SelectInput from './SelectInput';

export interface Professional {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  user_b_details: {
    profession: string;
    availability: any;
    years_experience?: number;
    bio?: string;
  };
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 1024,           // max-w-5xl
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  borderRadius: '16px',     // rounded-2xl
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column' as const,
  outline: 'none',
  mx: 2,                    // horizontal padding on small screens
};

export default function FindPro({ job, onClose }: { job: string; onClose: () => void }) {
  const [pros, setPros] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPro, setSelectedPro] = useState<string | null>(null);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const fetchPros = async () => {
      try {
        const res = await fetch(`/api/professionals?job=${encodeURIComponent(job)}`);
        if (res.ok) {
          const data = await res.json();
          setPros(data.professionals);
        }
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
          headers: { 'Authorization': `Bearer ${session.access_token}` },
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

    fetchPros();
    fetchUserAppointments();
  }, [job]);

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

  const isDateAvailable = (dateStr: string, pro: Professional) => {
    if (!dateStr) return false;
    const availability = pro.user_b_details.availability;
    if (!availability || Object.keys(availability).length === 0) return true;
    const dayName = getDayName(dateStr);
    return !!availability[dayName];
  };

  const getAvailableHours = (dateStr: string, pro: Professional) => {
    const defaultHours = Array.from({ length: 14 }, (_, i) => i + 7);
    if (!dateStr) return [];
    const availability = pro.user_b_details.availability;
    if (!availability || Object.keys(availability).length === 0) return defaultHours;
    const dayName = getDayName(dateStr);
    const daySchedule = availability[dayName];
    if (!daySchedule || !Array.isArray(daySchedule)) return [];
    const startHour = parseInt(daySchedule[0].split(':')[0], 10);
    const endHour = parseInt(daySchedule[1].split(':')[0], 10);
    const hours = [];
    for (let h = startHour; h < endHour; h++) hours.push(h);
    return hours;
  };

  const getAvailableDaysText = (pro: Professional) => {
    const availability = pro.user_b_details.availability;
    if (!availability || Object.keys(availability).length === 0) return 'Disponible tous les jours';
    const dayLabels: Record<string, string> = {
      monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer',
      thursday: 'Jeu', friday: 'Ven', saturday: 'Sam', sunday: 'Dim',
    };
    const availableDays = Object.keys(availability).map(day => dayLabels[day]).filter(Boolean);
    return availableDays.length > 0 ? `Dispo: ${availableDays.join(', ')}` : 'Aucune disponibilité';
  };

  const getBookingStatus = (proId: string) => {
    if (loadingAppointments) return { disabled: true, reason: 'Chargement...' };

    const professionCount = userAppointments.filter(a =>
      (a.status === 'CONFIRMED' || a.status === 'COMPLETED') &&
      a.user_b?.user_b_details?.profession === job
    ).length;

    if (professionCount >= 2) return { disabled: true, reason: 'Limite de 2 RDV atteinte pour ce métier' };

    const hasActiveWithPro = userAppointments.some(a =>
      a.user_b_id === proId && ['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(a.status)
    );

    if (hasActiveWithPro) return { disabled: true, reason: 'RDV actif en cours' };

    return { disabled: false, reason: '' };
  };

  const bookAppointment = async (proId: string) => {
    if (!selectedDate) {
      setToast({ message: 'Veuillez sélectionner une date.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    try {
      const dateObj = new Date(selectedDate);
      const hour = dateObj.getHours();

      if (hour < 7 || hour > 20) {
        setToast({ message: 'Les rendez-vous sont disponibles uniquement entre 7h00 et 20h00', type: 'error' });
        setTimeout(() => setToast(null), 3000);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setToast({ message: 'Session expirée. Veuillez vous reconnecter.', type: 'error' });
        setTimeout(() => setToast(null), 3000);
        return;
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userBId: proId, date: new Date(selectedDate).toISOString() }),
      });

      if (res.ok) {
        setToast({ message: 'Demande de rendez-vous envoyée !', type: 'success' });
        setTimeout(() => { setToast(null); onClose(); }, 2000);
      } else {
        const error = await res.json();
        setToast({ message: `Erreur lors de la réservation: ${error.error || 'Erreur inconnue'}`, type: 'error' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error(error);
      setToast({ message: 'Erreur lors de la réservation.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <Modal open onClose={onClose} aria-labelledby="find-pro-title">
        <Box sx={modalStyle}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 shrink-0">
            <div>
              <h2 id="find-pro-title" className="text-2xl uppercase font-bold text-primary">
                Réserver un rendez-vous
              </h2>
              <p className="mt-1">Profession : {job}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-secondary">
            {loading || loadingAppointments ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-600">Recherche en cours...</p>
                </div>
              </div>
            ) : pros.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600 font-medium">Aucun professionnel disponible</p>
                  <p className="text-gray-400 text-sm mt-1">Essayez une autre recherche</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {pros.map((pro) => {
                  const { disabled, reason } = getBookingStatus(pro.id);
                  const datePart = selectedPro === pro.id && selectedDate ? selectedDate.split('T')[0] : '';
                  const isAvailableDay = datePart ? isDateAvailable(datePart, pro) : true;
                  const availableHours = datePart ? getAvailableHours(datePart, pro) : [];
                  const isThisProSelected = selectedPro === pro.id;

                  return (
                    <div
                      key={pro.id}
                      className={`bg-white rounded-xl p-5 transition-all`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Professional Info */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shrink-0">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                              {pro.first_name} {pro.last_name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {pro.user_b_details.profession}
                              {pro.user_b_details.years_experience && (
                                <span className="text-gray-400 ml-2">
                                  • {pro.user_b_details.years_experience} ans d'exp.
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs text-gray-500">{getAvailableDaysText(pro)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking Controls */}
                        <div className="flex flex-col gap-3 lg:min-w-[420px]">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block text-primary mb-1 uppercase">Date</label>
                              <AvailableDatePicker
                                availability={pro.user_b_details.availability}
                                minDate={new Date().toISOString().split('T')[0]}
                                selectedDate={isThisProSelected ? (datePart || null) : null}
                                onDateSelect={(date) => {
                                  setSelectedPro(pro.id);
                                  setSelectedDate(`${date}T09:00:00.000Z`);
                                }}
                              />
                            </div>
                            <div className="w-32">
                              <SelectInput
                                label='Heure'
                                onChange={(e) => {
                                  const date = selectedDate
                                    ? selectedDate.split('T')[0]
                                    : new Date().toISOString().split('T')[0];
                                  setSelectedDate(`${date}T${e.target.value}:00:00.000Z`);
                                }}
                                disabled={disabled || !isAvailableDay || availableHours.length === 0 || !isThisProSelected}
                                value={
                                  isThisProSelected && selectedDate && selectedDate.includes('T')
                                    ? new Date(selectedDate).getHours().toString().padStart(2, '0')
                                    : ''
                                }
                              >
                                <option value="">--:--</option>
                                {availableHours.map(hour => (
                                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                                    {hour}:00
                                  </option>
                                ))}
                              </SelectInput>
                            </div>
                          </div>

                          {!isAvailableDay && datePart && isThisProSelected && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className="text-xs text-red-700 font-medium">
                                Professionnel non disponible ce jour
                              </span>
                            </div>
                          )}

                          <button
                            onClick={() => bookAppointment(pro.id)}
                            disabled={disabled || !selectedDate || !selectedDate.includes('T') || !isAvailableDay || !isThisProSelected}
                            className="button-secondary"
                            title={reason || (!isAvailableDay ? 'Professionnel non disponible ce jour' : '')}
                          >
                            {disabled ? reason : 'Confirmer le rendez-vous'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl shrink-0">
            <p className="text-center">
              💡 Sélectionnez une date et une heure pour confirmer votre rendez-vous
            </p>
          </div>
        </Box>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}