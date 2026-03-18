import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {
    Calendar, Clock, Video, User, Briefcase, Star,
    MessageSquare, X, CheckCircle, XCircle, AlertCircle, RefreshCw,
} from 'lucide-react';
import type { Appointment } from '../types';
import AppointmentMenu from './AppointmentCard/AppointmentMenu';

interface AppointmentDetailModalProps {
    appointment: Appointment;
    currentUserId: string;
    open: boolean;
    onClose: () => void;
    showStatus?: boolean;
    onUpdateStatus: (id: string, status: string | undefined, date?: string) => void;
    onOpenReviewModal: (id: string, name: string) => void;
    onOpenRescheduleModal: (id: string, date: string, proAvailability?: any, isUserA?: boolean) => void;
    onOpenConfirmDeleteModal: (id: string, title: string, confirmBtnText?: string) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
    CONFIRMED: { label: 'Confirmé', icon: <CheckCircle className="w-4 h-4" />, classes: 'bg-green-100  text-green-800' },
    COMPLETED: { label: 'Terminé', icon: <CheckCircle className="w-4 h-4" />, classes: 'bg-gray-100   text-gray-600' },
    PENDING: { label: 'En attente', icon: <AlertCircle className="w-4 h-4" />, classes: 'bg-yellow-100 text-yellow-800' },
    RESCHEDULED: { label: 'Reprogrammé', icon: <RefreshCw className="w-4 h-4" />, classes: 'bg-orange-100 text-orange-700' },
    CANCELLED: { label: 'Annulé', icon: <XCircle className="w-4 h-4" />, classes: 'bg-red-100    text-red-700' },
};

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-gray-400 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
                <div className="text-sm text-gray-800">{children}</div>
            </div>
        </div>
    );
}

function Stars({ rating }: { rating: number }) {
    return (
        <span className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
        </span>
    );
}

// ─── Modal Style ──────────────────────────────────────────────────────────────

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: 520,
    outline: 'none',
    mx: 2,
};

// ─── Type Guard ───────────────────────────────────────────────────────────────

function isUserB(user: any): user is {
    id: string; first_name: string; last_name: string; avatar_url: string; gemail: string; user_b_details: { profession: string; availability?: any; years_experience: string }
} {
    return user && 'user_b_details' in user;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppointmentDetailModal({
    appointment: apt,
    currentUserId,
    open,
    onClose,
    onOpenConfirmDeleteModal,
    onOpenRescheduleModal,
    onOpenReviewModal,
    onUpdateStatus,
}: AppointmentDetailModalProps) {
    const isUserA = apt.user_a?.id === currentUserId;
    const status = STATUS_CONFIG[apt.status] ?? STATUS_CONFIG['CANCELLED'];

    const aptDate = new Date(apt.date);
    const formattedDate = aptDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = aptDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    // Determine the "other party"
    const otherParty = isUserA ? apt.user_b : apt.user_a;
    const otherLabel = isUserA ? 'Professionnel' : 'Client';

    const otherProfession = isUserB(otherParty) ? otherParty.user_b_details.profession : undefined;
    const otherExperience = isUserB(otherParty) ? otherParty.user_b_details.years_experience : undefined;

    return (
        <Modal className='overflow-y-scroll' open={open} onClose={onClose} aria-labelledby="apt-detail-title">
            <Box sx={modalStyle}>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="relative bg-primary px-6 pt-6 pb-10">
                        <div className='flex justify-between pb-6'>

                            <AppointmentMenu
                                appointment={apt}
                                variant='default'
                                currentUserId={currentUserId}
                                onOpenConfirmDeleteModal={onOpenConfirmDeleteModal}
                                onOpenRescheduleModal={onOpenRescheduleModal}
                                onOpenReviewModal={onOpenReviewModal}
                                onUpdateStatus={onUpdateStatus}
                            />

                            <button
                                onClick={onClose}
                                className="rounded-full flex items-center justify-center w-9 h-9 bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                                aria-label="Fermer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                            Rendez-vous
                        </p>
                        <h2 id="apt-detail-title" className="text-white text-xl font-extrabold leading-tight">
                            {otherParty?.first_name} {otherParty?.last_name}
                        </h2>

                        {otherProfession && (
                            <p className="text-white/75 text-sm mt-1">
                                {otherProfession}
                                {otherExperience && <span className="ml-2">· {otherExperience} ans d'expérience</span>}
                            </p>
                        )}

                        {/* Status pill */}
                        <div className={`absolute -bottom-4 left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${status.classes}`}>
                            {status.icon}
                            {status.label}
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 pt-8 pb-6 space-y-5">

                        {/* Date */}
                        <Row icon={<Calendar className="w-4 h-4" />} label="Date">
                            <span className="capitalize">{formattedDate}</span>
                        </Row>

                        {/* Time */}
                        <Row icon={<Clock className="w-4 h-4" />} label="Heure">
                            {formattedTime}
                        </Row>

                        {/* Other party info */}
                        {otherParty && (
                            <Row icon={<User className="w-4 h-4" />} label={otherLabel}>
                                <span className="font-semibold">{otherParty.first_name} {otherParty.last_name}</span>
                                {/* Email */}
                                {'email' in otherParty ? (
                                    <p className="text-gray-500 text-xs mt-0.5">{otherParty.email}</p>
                                ) : 'gemail' in otherParty ? (
                                    <p className="text-gray-500 text-xs mt-0.5">{otherParty.gemail}</p>
                                ) : null}
                            </Row>
                        )}

                        {/* Profession (if user_b) */}
                        {otherProfession && (
                            <Row icon={<Briefcase className="w-4 h-4" />} label="Profession">
                                {otherProfession}
                                {otherExperience && <span className="text-gray-400 ml-2">· {otherExperience} ans d'expérience</span>}
                            </Row>
                        )}

                        {/* Meeting link */}
                        {apt.meeting_link && (
                            <Row icon={<Video className="w-4 h-4" />} label="Visioconférence">
                                <a href={apt.meeting_link} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium break-all">
                                    Rejoindre la réunion
                                </a>
                            </Row>
                        )}

                        {/* Proposed reschedule */}
                        {apt.status === 'RESCHEDULED' && apt.proposed_date && (
                            <Row icon={<RefreshCw className="w-4 h-4 text-orange-500" />} label="Nouvelle date proposée">
                                <div className="flex flex-col gap-0.5">
                                    <span className="capitalize">
                                        {new Date(apt.proposed_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <span className="text-gray-500">
                                        à {new Date(apt.proposed_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="text-xs text-orange-600 italic mt-0.5">
                                        {apt.proposed_by === currentUserId ? 'Vous avez proposé cette date' : 'En attente de votre réponse'}
                                    </span>
                                </div>
                            </Row>
                        )}

                        {/* Review section */}
                        {apt.has_review && apt.review && (
                            <div className="border-t border-gray-100 pt-5">
                                <Row icon={<MessageSquare className="w-4 h-4" />} label={isUserA ? 'Votre avis' : 'Avis client'}>
                                    <div className="flex flex-col gap-1 mt-0.5">
                                        <Stars rating={apt.review.rating} />
                                        {apt.review.comment && (
                                            <p className="text-gray-600 text-sm italic">"{apt.review.comment}"</p>
                                        )}
                                    </div>
                                </Row>
                            </div>
                        )}

                    </div>
                </div>
            </Box>
        </Modal>
    );
}