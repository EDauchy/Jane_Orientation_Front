import { useState } from 'react';
import { X, Clock, CalendarClock } from 'lucide-react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AvailableDatePicker from './AvailableDatePicker';
import SelectInput from './SelectInput';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: string) => void;
  currentDate?: string;
  proAvailability?: Record<string, string[]> | null;
  isUserA?: boolean;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 460,
  outline: 'none',
  mx: 2,
};

export default function RescheduleModal({
  isOpen,
  onClose,
  onSubmit,
  currentDate,
  proAvailability,
  isUserA = false,
}: RescheduleModalProps) {

  // ─── Date helpers ─────────────────────────────────────────────────────────

  const parseDateLocal = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const getTodayAvailableHours = () => {
    const now = new Date();
    const minHour = now.getHours() + 1;
    return Array.from({ length: 14 }, (_, i) => i + 7).filter(h => h > minHour && h <= 20);
  };

  const getMinDateForUserB = () => {
    const now = new Date();
    if (getTodayAvailableHours().length === 0) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    return now.toISOString().split('T')[0];
  };

  const currentDateObj = currentDate ? new Date(currentDate) : new Date();
  let initialDate = [
    currentDateObj.getFullYear(),
    String(currentDateObj.getMonth() + 1).padStart(2, '0'),
    String(currentDateObj.getDate()).padStart(2, '0'),
  ].join('-');

  if (!isUserA) {
    const minDate = getMinDateForUserB();
    if (parseDateLocal(initialDate) < parseDateLocal(minDate)) initialDate = minDate;
  }

  const initialTime = currentDate ? currentDateObj.toTimeString().slice(0, 5) : '';

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);

  // ─── Available hours ──────────────────────────────────────────────────────

  const getAvailableHours = (): number[] => {
    const defaultHours = Array.from({ length: 14 }, (_, i) => i + 7);

    if (!isUserA) {
      const now = new Date();
      const selectedDateObj = date ? parseDateLocal(date) : null;
      if (selectedDateObj && selectedDateObj.toDateString() === now.toDateString()) {
        const minHour = now.getHours() + 1;
        return defaultHours.filter(h => h > minHour);
      }
      return defaultHours;
    }

    if (!date || !proAvailability || Object.keys(proAvailability).length === 0) return defaultHours;

    const dayName = parseDateLocal(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = proAvailability[dayName];
    if (!daySchedule || !Array.isArray(daySchedule)) return [];

    const startHour = parseInt(daySchedule[0].split(':')[0], 10);
    const endHour = parseInt(daySchedule[1].split(':')[0], 10);
    const hours = [];
    for (let h = startHour; h < endHour; h++) hours.push(h);
    return hours;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const availableHours = getAvailableHours();
  const minDate = (!isUserA && date && new Date(date).toDateString() === new Date().toDateString() && availableHours.length === 0)
    ? tomorrowStr : todayStr;

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const [hour, minute] = time.split(':').map(Number);

    if (!isUserA) {
      const proposedDate = new Date(`${date}T${time}`);
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
      if (proposedDate <= oneHourFromNow) return;
    }

    if (hour < 7 || hour > 20 || (hour === 20 && minute > 0)) return;

    onSubmit(new Date(`${date}T${time}`).toISOString());
    onClose();
  };

  // ─── Helper text ──────────────────────────────────────────────────────────

  const getHelperText = () => {
    if (availableHours.length === 0) {
      if (!isUserA && date && parseDateLocal(date).toDateString() === new Date().toDateString()) {
        return 'Aucun créneau disponible aujourd\'hui — choisissez un autre jour.';
      }
      return 'Sélectionnez d\'abord une date.';
    }
    if (isUserA && proAvailability && Object.keys(proAvailability).length > 0) {
      return 'Créneaux selon les horaires du professionnel.';
    }
    if (!isUserA) return 'Minimum 1h après l\'heure actuelle.';
    return 'Créneaux disponibles entre 7h et 20h.';
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby="reschedule-title">
      <Box sx={modalStyle}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary/90 to-primary px-6 pt-6 pb-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 id="reschedule-title" className="text-white text-lg font-extrabold leading-tight">
                  Proposer une nouvelle date
                </h2>
                <p className="text-white/70 text-xs mt-0.5">
                  Suggérez un autre créneau pour ce rendez-vous
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

            {/* Date picker */}
            <div>
              <label className="block text-primary mb-1 uppercase">
                Date
              </label>
              <AvailableDatePicker
                availability={isUserA ? (proAvailability || null) : null}
                minDate={!isUserA ? getMinDateForUserB() : todayStr}
                selectedDate={date}
                onDateSelect={(newDate) => { setDate(newDate); setTime(''); }}
              />
              {isUserA && proAvailability && Object.keys(proAvailability).length > 0 && (
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  <span>📅</span> Seuls les jours disponibles du professionnel sont sélectionnables
                </p>
              )}
            </div>

            {/* Time picker */}
            <div>
              <SelectInput
                label='Heure'
                required
                value={time.split(':')[0]}
                onChange={(e) => setTime(`${e.target.value.padStart(2, '0')}:00`)}
                disabled={!date || availableHours.length === 0}
              >
                <option value="">Choisir une heure</option>
                {availableHours.map(hour => (
                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                    {hour}:00
                  </option>
                ))}
              </SelectInput>
              <p className="text-xs text-gray-400 mt-1.5">{getHelperText()}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className='button-cancel'
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!date || !time}
                className='button-primary'
              >
                Proposer
              </button>
            </div>
          </form>

        </div>
      </Box>
    </Modal>
  );
}