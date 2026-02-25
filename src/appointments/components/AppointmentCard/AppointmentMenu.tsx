import { Check, X, Clock, MessageSquare, Star, MoreHorizontal, Video, CalendarClock, Trash2, Ban } from 'lucide-react';
import { MdEdit } from 'react-icons/md';
import Popover from '@mui/material/Popover';
import { useState } from 'react';
import type { Appointment } from '../../types';
import { STATUS_DOT, STATUS_LABEL } from './StatusIndicator';

// ─── MenuItem ────────────────────────────────────────────────────────────────

export interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'default' | 'danger' | 'success' | 'warning' | 'info';
    disabled?: boolean;
}

export function MenuItem({ icon, label, onClick, href, variant = 'default', disabled }: MenuItemProps) {
    const variantClasses: Record<string, string> = {
        default: 'text-gray-700 hover:bg-gray-50',
        danger: 'text-red-600   hover:bg-red-50',
        success: 'text-green-600 hover:bg-green-50',
        warning: 'text-orange-600 hover:bg-orange-50',
        info: 'text-blue-600  hover:bg-blue-50',
    };

    const base = `flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium transition-colors text-left ${disabled ? '!font-bold cursor-default pointer-events-none' : 'cursor-pointer'
        } ${variantClasses[variant]}`;

    if (href) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={base}>
                <span className="shrink-0">{icon}</span>
                <span>{label}</span>
            </a>
        );
    }

    return (
        <button onClick={onClick} disabled={disabled} className={base}>
            <span className="shrink-0">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

export function MenuDivider() {
    return <div className="border-t border-gray-100" />;
}

// ─── AppointmentMenu ─────────────────────────────────────────────────────────

interface AppointmentMenuProps {
    appointment: Appointment;
    currentUserId: string;
    showStatus?: boolean;
    onUpdateStatus: (id: string, status: string | undefined, date?: string) => void;
    onOpenReviewModal: (id: string, name: string) => void;
    onOpenRescheduleModal: (id: string, date: string, proAvailability?: any, isUserA?: boolean) => void;
    onOpenConfirmDeleteModal: (id: string, title: string, confirmBtnText?: string) => void;
}

export default function AppointmentMenu({
    appointment: apt,
    currentUserId,
    showStatus = false,
    onUpdateStatus,
    onOpenReviewModal,
    onOpenRescheduleModal,
    onOpenConfirmDeleteModal,
}: AppointmentMenuProps) {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const menuOpen = Boolean(menuAnchor);
    const closeMenu = () => setMenuAnchor(null);

    const isUserA = (apt as any).user_a_id === currentUserId;
    const isUserB = (apt as any).user_b_id === currentUserId;
    const isPast = new Date(apt.date) < new Date();
    const isFuture = new Date(apt.date) > new Date();

    type Section = MenuItemProps[];
    const sections: Section[] = [];

    // Status row (minimal variant only)
    if (showStatus) {
        sections.push([{
            icon: <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[apt.status] ?? 'bg-gray-400'}`} />,
            label: STATUS_LABEL[apt.status] ?? apt.status,
            disabled: true,
        }]);
    }

    // Meeting link
    if (apt.meeting_link) {
        sections.push([{
            icon: <Video className="w-4 h-4" />,
            label: 'Rejoindre la visioconférence',
            href: apt.meeting_link,
            variant: 'info',
        }]);
    }

    // Rescheduling negotiation
    if (apt.status === 'RESCHEDULED' && apt.proposed_date) {
        const section: MenuItemProps[] = [{
            icon: <Clock className="w-4 h-4" />,
            label: `Proposition : ${new Date(apt.proposed_date).toLocaleString('fr-FR')}`,
            variant: 'warning',
            disabled: true,
        }];

        if (apt.proposed_by !== currentUserId) {
            section.push(
                {
                    icon: <MdEdit className="w-4 h-4" />,
                    label: 'Contre-proposer une date',
                    variant: 'warning',
                    onClick: () => { closeMenu(); onOpenRescheduleModal(apt.id, apt.proposed_date!, apt.user_b?.user_b_details?.availability, isUserA); },
                },
                {
                    icon: <Check className="w-4 h-4" />,
                    label: 'Accepter la proposition',
                    variant: 'success',
                    onClick: () => { closeMenu(); onUpdateStatus(apt.id, 'CONFIRMED'); },
                },
            );
        }

        sections.push(section);
    }

    // Schedule actions
    const scheduleSection: MenuItemProps[] = [];

    if (apt.status === 'PENDING' || apt.status === 'CONFIRMED') {
        scheduleSection.push({
            icon: <CalendarClock className="w-4 h-4" />,
            label: 'Proposer une autre date',
            onClick: () => { closeMenu(); onOpenRescheduleModal(apt.id, apt.date, apt.user_b?.user_b_details?.availability, isUserA); },
        });
    }

    if (apt.status === 'PENDING' && isUserB) {
        scheduleSection.push({
            icon: <Check className="w-4 h-4" />,
            label: 'Confirmer le rendez-vous',
            variant: 'success',
            onClick: () => { closeMenu(); onUpdateStatus(apt.id, 'CONFIRMED'); },
        });
    }

    if (scheduleSection.length) sections.push(scheduleSection);

    // Review
    const reviewSection: MenuItemProps[] = [];

    if ((apt.status === 'CONFIRMED' || apt.status === 'COMPLETED') && isUserA && isPast) {
        if (apt.has_review && apt.review) {
            const stars = '★'.repeat(apt.review.rating) + '☆'.repeat(5 - apt.review.rating);
            reviewSection.push({
                icon: <MessageSquare className="w-4 h-4" />,
                label: apt.review.comment ? `Votre avis (${stars}) — "${apt.review.comment}"` : `Avis déposé (${stars})`,
                variant: 'info',
                disabled: true,
            });
        } else {
            reviewSection.push({
                icon: <Star className="w-4 h-4" />,
                label: 'Noter le professionnel',
                variant: 'warning',
                onClick: () => { closeMenu(); onOpenReviewModal(apt.id, `${apt.user_b?.first_name} ${apt.user_b?.last_name}`); },
            });
        }
    }

    if ((apt.status === 'CONFIRMED' || apt.status === 'COMPLETED') && isUserB && isPast && apt.has_review && apt.review) {
        const stars = '★'.repeat(apt.review.rating) + '☆'.repeat(5 - apt.review.rating);
        reviewSection.push({
            icon: <MessageSquare className="w-4 h-4" />,
            label: apt.review.comment ? `Avis reçu (${stars}) — "${apt.review.comment}"` : `Avis reçu (${stars})`,
            variant: 'info',
            disabled: true,
        });
    }

    if (reviewSection.length) sections.push(reviewSection);

    // Destructive
    const destructiveSection: MenuItemProps[] = [];

    if (apt.status === 'CONFIRMED' && (isUserA || isUserB) && isFuture) {
        destructiveSection.push({
            icon: <Ban className="w-4 h-4" />,
            label: 'Annuler le rendez-vous',
            variant: 'danger',
            onClick: () => {
                closeMenu();
                const msg = isUserA
                    ? 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?'
                    : 'Êtes-vous sûr de vouloir annuler ce rendez-vous avec le client ?';
                onOpenConfirmDeleteModal(apt.id, msg, 'Annuler le RDV');
            },
        });
    }

    if (apt.status === 'PENDING' && isUserB) {
        destructiveSection.push({
            icon: <X className="w-4 h-4" />,
            label: 'Refuser le rendez-vous',
            variant: 'danger',
            onClick: () => { closeMenu(); onUpdateStatus(apt.id, 'CANCELLED'); },
        });
    }

    if (apt.status === 'PENDING' && isUserA) {
        destructiveSection.push({
            icon: <Trash2 className="w-4 h-4" />,
            label: 'Supprimer la demande',
            variant: 'danger',
            onClick: () => {
                closeMenu();
                const proName = apt.user_b ? `${apt.user_b.first_name} ${apt.user_b.last_name}` : 'Professionnel';
                const dateStr = new Date(apt.date).toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                onOpenConfirmDeleteModal(apt.id, `Supprimer le rendez-vous avec ${proName} le ${dateStr} ?`, 'Supprimer');
            },
        });
    }

    if (destructiveSection.length) sections.push(destructiveSection);

    if (sections.length === 0) return null;

    return (
        <div className="shrink-0 mr-1">
            <button
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                aria-label="Actions"
                aria-haspopup="true"
                aria-expanded={menuOpen}
            >
                <MoreHorizontal className="w-5 h-5" />
            </button>

            <Popover
                open={menuOpen}
                anchorEl={menuAnchor}
                onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            minWidth: 260,
                            overflow: 'hidden',
                            mt: 0.5,
                        },
                    },
                }}
            >
                <div>
                    {sections.map((section, si) => (
                        <div key={si}>
                            {si > 0 && <MenuDivider />}
                            {section.map((item, ii) => (
                                <MenuItem key={ii} {...item} />
                            ))}
                        </div>
                    ))}
                </div>
            </Popover>
        </div>
    );
}