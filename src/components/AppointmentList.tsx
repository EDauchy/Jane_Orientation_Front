import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Calendar, Check, X, Star, Clock, RefreshCw, MessageSquare, Edit } from 'lucide-react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { MdEdit } from "react-icons/md";
import ReviewModal from './ReviewModal';
import RescheduleModal from './RescheduleModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import Toast from './Toast';

interface Appointment {
  id: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED';
  meeting_link?: string;
  user_a?: { id: string; first_name: string; last_name: string; email: string };
  user_b?: { id: string; first_name: string; last_name: string; email: string; user_b_details: { profession: string; availability?: any } };
  has_review?: boolean;
  review?: { rating: number; comment?: string };
  proposed_date?: string;
  proposed_by?: string;
}

export default function AppointmentList() {
  const { user } = useAuth();
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
const [popoverAppointmentId, setPopoverAppointmentId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{ appointmentId: string; professionalName: string } | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{ appointmentId: string; currentDate: string; proAvailability?: any; isUserA: boolean } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    appointmentId: string;
    title: string;
    confirmBtnText?: string;
  } | null>(null);

  const fetchAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error('No session token');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments);
      } else {
        console.error('Failed to fetch appointments:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching appointments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, appointmentId: string) => {
  setPopoverAnchor(event.currentTarget);
  setPopoverAppointmentId(appointmentId);
};

const handlePopoverClose = () => {
  setPopoverAnchor(null);
  setPopoverAppointmentId(null);
};

const isPopoverOpen = Boolean(popoverAnchor);


  const updateStatus = async (id: string, status: string, date?: string) => {
    try {
      console.log(`updateStatus called - ID: ${id}, Status: ${status}, Date: ${date}`);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        console.error('No session token found');
        setToast({ message: 'Session expirée. Veuillez vous reconnecter.', type: 'error' });
        return;
      }

      console.log('Session token found, making PATCH request...');
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status, date }),
      });

      console.log('Response status:', res.status, res.statusText);

      if (res.ok) {
        console.log('Update successful, refreshing appointments...');
        const successMessage = status === 'CONFIRMED'
          ? 'Rendez-vous confirmé !'
          : status === 'CANCELLED'
            ? 'Rendez-vous annulé'
            : date
              ? 'Nouvelle date proposée !'
              : 'Rendez-vous mis à jour';
        setToast({ message: successMessage, type: 'success' });
        fetchAppointments(); // Refresh
        setTimeout(() => setToast(null), 3000);
      } else {
        const error = await res.json();
        console.error('Update failed:', error);
        setToast({ message: error.error || 'Impossible de mettre à jour le rendez-vous', type: 'error' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error('Error updating appointment', error);
      setToast({ message: 'Erreur lors de la mise à jour', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <div>Loading appointments...</div>;

  if (appointments.length === 0) {
    return <div className="text-gray-500">Aucun rendez-vous prévu.</div>;
  }

  return (
    <>
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-white border border-3 border-primary rounded-full shadow-sm flex gap-4">
            <div className='w-12 bg-gray-200 rounded-full bg-center bg-no-repeat bg-contain bg-[url(https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010)]'></div>
            <div className="font-extrabold text-primary pr-4 py-1 border-r-3 border-primary self-center">
              {apt.user_b?.first_name} {apt.user_b?.last_name}
            </div>
            <div className="font-bold text-primary flex flex-col uppercase grow text-sm py-1">
              <span>Le {new Date(apt.date).toLocaleDateString()}</span>
              <span>à {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className={`px-2 py-0.5 rounded text-xs font-bold h-fit self-center ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              apt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
              }`}>
              {apt.status}
            </div>
            {!apt.meeting_link && (
              <div className="mt-1 text-sm">
                <a href={apt.meeting_link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                  Lien de visioconférence
                </a>
              </div>
            )}

{/* Rescheduling Negotiation UI */}
{apt.status === 'RESCHEDULED' && apt.proposed_date && (
  <div className="flex gap-2">
    {/* Clock icon with hover popover (replaces visible date text) */}
    <button
      onMouseEnter={(e) => handlePopoverOpen(e, apt.id)}
      onMouseLeave={handlePopoverClose}
      className="text-orange-600 bg-orange-50 p-2 rounded-full hover:bg-orange-100 cursor-pointer transition-colors flex items-center justify-center self-center"
    >
      <Clock className="w-4 h-4" />
    </button>

    <Popover
      open={isPopoverOpen && popoverAppointmentId === apt.id}
      anchorEl={popoverAnchor}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      disableRestoreFocus
      sx={{ pointerEvents: 'none' }}
    >
      <Typography sx={{ p: 2 }}>
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-orange-600">
            Proposition :
          </span>
          <span>
            {new Date(apt.proposed_date).toLocaleString('fr-FR')}
          </span>
          <span className="text-xs text-gray-500 italic mt-1">
            En attente de réponse...
          </span>
        </div>
      </Typography>
    </Popover>

    {/* KEEPING your action buttons exactly as before */}
    {user && apt.proposed_by !== user.id ? (
      <div>
        <button
          onClick={() => {
            setRescheduleModal({
              appointmentId: apt.id,
              currentDate: apt.proposed_date!,
              proAvailability: apt.user_b?.user_b_details?.availability,
              isUserA: user?.id === apt.user_a?.id
            });
          }}
          className="border-l-3 border-primary h-full px-3 cursor-pointer"
          title="Proposer une autre date"
        >
          <MdEdit className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={() => updateStatus(apt.id, 'CONFIRMED')}
          className="border-l-3 border-primary h-full px-3 cursor-pointer"
        >
          <Check className="w-5 h-5 text-primary" />
        </button>
      </div>
    ) : (
      null
    )}
  </div>
)}

            {/* Standard Actions */}
            <div>
              {/* Reschedule Button (Available for Pending/Confirmed) */}
              {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                <button
                  onClick={() => {
                    setRescheduleModal({
                      appointmentId: apt.id,
                      currentDate: apt.date,
                      proAvailability: apt.user_b?.user_b_details?.availability,
                      isUserA: user?.id === apt.user_a?.id
                    });
                  }}
                  className="border-l-3 border-primary h-full px-3 cursor-pointer"
                  title="Proposer une autre date"
                >
                  <MdEdit className="w-5 h-5 text-primary" />
                </button>
              )}

              {/* User B can confirm/cancel PENDING appointments */}
              {apt.status === 'PENDING' && user && (apt as any).user_b_id === user.id && (
                <>
                  <button
                    onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                    className="border-l-3 border-primary h-full px-3 cursor-pointer"
                    title="Confirmer"
                  >
                    <Check className="w-5 h-5 text-primary" />
                  </button>
                  <button
                    onClick={() => updateStatus(apt.id, 'CANCELLED')}
                    className="text-white bg-primary h-full rounded-r-full px-3 cursor-pointer"
                    title="Refuser"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* User A can review CONFIRMED or COMPLETED appointments that have passed */}
              {(apt.status === 'CONFIRMED' || apt.status === 'COMPLETED') &&
                user &&
                (apt as any).user_a_id === user.id &&
                new Date(apt.date) < new Date() && (
                  apt.has_review ? (
                    <div className="relative group">
                      <div className="p-2 text-blue-600 bg-blue-50 rounded-full cursor-help">
                        <MessageSquare className="w-5 h-5 fill-blue-600" />
                      </div>
                      {apt.review && (
                        <div className="absolute right-0 top-full mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg w-64 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < apt.review!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                            ))}
                          </div>
                          {apt.review.comment && <p className="text-xs">{apt.review.comment}</p>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setReviewModal({
                        appointmentId: apt.id,
                        professionalName: `${apt.user_b?.first_name} ${apt.user_b?.last_name}`
                      })}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all shadow-md"
                      title="Noter le professionnel"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      <span className="text-sm font-medium">Noter</span>
                    </button>
                  )
                )}

              {/* User B view: Show review icon for past appointments with reviews */}
              {(apt.status === 'CONFIRMED' || apt.status === 'COMPLETED') &&
                user &&
                (apt as any).user_b_id === user.id &&
                new Date(apt.date) < new Date() &&
                apt.has_review &&
                apt.review && (
                  <div className="relative group">
                    <div className="p-2 text-green-600 bg-green-50 rounded-full cursor-help">
                      <MessageSquare className="w-5 h-5 fill-green-600" />
                    </div>
                    <div className="absolute right-0 top-full mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg w-64 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < apt.review!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                        ))}
                      </div>
                      {apt.review.comment && <p className="text-xs">{apt.review.comment}</p>}
                    </div>
                  </div>
                )}

              {/* User A or User B can CANCEL confirmed appointments (if future) */}
              {apt.status === 'CONFIRMED' &&
                user &&
                ((apt as any).user_a_id === user.id || (apt as any).user_b_id === user.id) &&
                new Date(apt.date) > new Date() && (
                  <button
                    onClick={() => {
                      const isUserA = (apt as any).user_a_id === user.id;
                      const message = isUserA
                        ? 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?'
                        : 'Êtes-vous sûr de vouloir annuler ce rendez-vous avec le client ?';

                      setConfirmDeleteModal({
                        appointmentId: apt.id,
                        title: message,
                        confirmBtnText: 'Annuler le RDV'
                      });
                    }}
                    className="text-white bg-primary h-full rounded-r-full px-3 cursor-pointer"
                    title="Annuler le rendez-vous"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

              {/* User A can also DELETE pending appointments */}
              {apt.status === 'PENDING' &&
                user &&
                (apt as any).user_a_id === user.id && (
                  <button
                    onClick={() => {
                      const proName = apt.user_b ? `${apt.user_b.first_name} ${apt.user_b.last_name}` : 'Professionnel';
                      const dateStr = new Date(apt.date).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      setConfirmDeleteModal({
                        appointmentId: apt.id,
                        title: `Supprimer le rendez-vous avec ${proName} le ${dateStr} ?`,
                        confirmBtnText: 'Supprimer'
                      });
                    }}
                    className="text-white bg-primary h-full rounded-r-full px-3 cursor-pointer"
                    title="Supprimer la demande"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <ReviewModal
          appointmentId={reviewModal.appointmentId}
          professionalName={reviewModal.professionalName}
          onClose={() => setReviewModal(null)}
          onSuccess={() => {
            fetchAppointments(); // Refresh to update has_review
          }}
        />
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <RescheduleModal
          isOpen={!!rescheduleModal}
          onClose={() => setRescheduleModal(null)}
          currentDate={rescheduleModal.currentDate}
          proAvailability={rescheduleModal.proAvailability}
          isUserA={rescheduleModal.isUserA}
          onSubmit={(date) => {
            // Validate date before submitting
            const dateObj = new Date(date);
            const hour = dateObj.getHours();
            const minute = dateObj.getMinutes();

            if (hour < 7 || hour > 20 || (hour === 20 && minute > 0)) {
              setToast({ message: 'Les rendez-vous sont disponibles uniquement entre 7h00 et 20h00', type: 'error' });
              setTimeout(() => setToast(null), 3000);
              return;
            }

            if (!rescheduleModal.isUserA) {
              const now = new Date();
              const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
              if (dateObj <= oneHourFromNow) {
                setToast({ message: 'Vous devez proposer un créneau au moins 1 heure après l\'heure actuelle', type: 'error' });
                setTimeout(() => setToast(null), 3000);
                return;
              }
            }

            // When proposing a date, don't send status - just the date
            // The backend will automatically set status to RESCHEDULED
            updateStatus(rescheduleModal.appointmentId, undefined, date);
          }}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteModal && (
        <ConfirmDeleteModal
          isOpen={!!confirmDeleteModal}
          onClose={() => setConfirmDeleteModal(null)}
          onConfirm={() => {
            updateStatus(confirmDeleteModal.appointmentId, 'CANCELLED');
          }}
          title={confirmDeleteModal.title}
          confirmText={confirmDeleteModal.confirmBtnText || "Supprimer"}
          cancelText="Retour"
        />
      )}
    </>
  );
}
