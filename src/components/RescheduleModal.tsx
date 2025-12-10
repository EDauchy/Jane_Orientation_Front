import { useState } from 'react';
import { X, Clock } from 'lucide-react';
import AvailableDatePicker from './AvailableDatePicker';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (date: string) => void;
  currentDate?: string;
  proAvailability?: Record<string, string[]> | null;
  isUserA?: boolean; // Only filter for User A
}

export default function RescheduleModal({ isOpen, onClose, onSubmit, currentDate, proAvailability, isUserA = false }: RescheduleModalProps) {

  const parseDateLocal = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to calculate if there are available hours today for User B
  const getTodayAvailableHours = () => {
    const now = new Date();
    const minHour = now.getHours() + 1; // At least 1 hour from now
    const maxHour = 20; // Until 20h
    const defaultHours = Array.from({ length: 14 }, (_, i) => i + 7);
    return defaultHours.filter(h => h > minHour && h <= maxHour);
  };

  // Calculate minimum date for User B
  const getMinDateForUserB = () => {
    const todayAvailableHours = getTodayAvailableHours();
    const now = new Date();

    // If no hours available today, return tomorrow
    if (todayAvailableHours.length === 0) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }

    // Otherwise, today is fine
    return now.toISOString().split('T')[0];
  };

  const currentDateObj = currentDate ? new Date(currentDate) : new Date();

  // For User B, check if we need to force tomorrow
  let initialDate = `${currentDateObj.getFullYear()}-${String(currentDateObj.getMonth() + 1).padStart(2, '0')}-${String(currentDateObj.getDate()).padStart(2, '0')}`;

  if (!isUserA) {
    const minDate = getMinDateForUserB();
    const initialDateObj = parseDateLocal(initialDate);
    const minDateObj = parseDateLocal(minDate);

    // If initial date is before minDate, use minDate
    if (initialDateObj < minDateObj) {
      initialDate = minDate;
    }
  }

  const initialTime = currentDate ? currentDateObj.toTimeString().slice(0, 5) : '';

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);

  if (!isOpen) return null;

  // Helper to get available hours for selected date
  const getAvailableHours = () => {
    const defaultHours = Array.from({ length: 14 }, (_, i) => i + 7);

    // User B (professional) can choose any hour - but must be +1h from now
    if (!isUserA) {
      const now = new Date();
      const selectedDateObj = date ? parseDateLocal(date) : null;

      // If selected date is today, filter hours to be at least +1h from now
      if (selectedDateObj) {
        const isToday = selectedDateObj.toDateString() === now.toDateString();

        if (isToday) {
          const minHour = now.getHours() + 1; // At least 1 hour from now
          const filtered = defaultHours.filter(h => h > minHour);
          return filtered;
        }
      }

      return defaultHours;
    }

    // User A: filter based on professional's availability
    if (!date || !proAvailability || Object.keys(proAvailability).length === 0) {
      return defaultHours;
    }

    const selectedDateObj = parseDateLocal(date);
    const dayName = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = proAvailability[dayName];

    if (!daySchedule || !Array.isArray(daySchedule)) return [];

    const startHour = parseInt(daySchedule[0].split(':')[0], 10);
    const endHour = parseInt(daySchedule[1].split(':')[0], 10);

    const hours = [];
    for (let h = startHour; h < endHour; h++) {
      hours.push(h);
    }
    return hours;
  };

  // Determine minimum selectable date for User B when no slots today
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const availableHours = getAvailableHours();
  const minDate = (!isUserA && date && new Date(date).toDateString() === new Date().toDateString() && availableHours.length === 0)
    ? tomorrowStr
    : todayStr;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const [hour, minute] = time.split(':').map(Number);

    // For User B, check minimum 1 hour from now
    if (!isUserA) {
      const now = new Date();
      const proposedDate = new Date(`${date}T${time}`);
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      if (proposedDate <= oneHourFromNow) {
        // Error will be shown by parent component via toast
        console.error('Vous devez proposer un créneau au moins 1 heure après l\'heure actuelle');
        return;
      }
    }

    if (hour < 7 || hour > 20 || (hour === 20 && minute > 0)) {
      // Error will be shown by parent component via toast
      console.error('Les rendez-vous sont disponibles uniquement entre 7h00 et 20h00');
      return;
    }

    const dateTime = new Date(`${date}T${time}`);
    onSubmit(dateTime.toISOString());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Proposer une nouvelle date</h2>
            <p className="text-blue-100 text-sm mt-1">Suggérez un autre créneau pour ce rendez-vous</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <AvailableDatePicker
                availability={isUserA ? (proAvailability || null) : null}
                minDate={!isUserA ? getMinDateForUserB() : new Date().toISOString().split('T')[0]}
                selectedDate={date}
                onDateSelect={(newDate) => {
                  setDate(newDate);
                  setTime(''); // Reset time when date changes
                }}
              />
              {isUserA && proAvailability && Object.keys(proAvailability).length > 0 && (
                <p className="text-xs text-gray-500 mt-1.5">
                  📅 Seuls les jours disponibles du professionnel sont sélectionnables
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heure (7h - 20h)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  required
                  value={time.split(':')[0]}
                  onChange={(e) => setTime(`${e.target.value.padStart(2, '0')}:00`)}
                  disabled={!date || availableHours.length === 0}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Choisir une heure</option>
                  {availableHours.map(hour => (
                    <option key={hour} value={hour.toString().padStart(2, '0')}>
                      {hour}:00
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                {availableHours.length > 0
                  ? isUserA && proAvailability && Object.keys(proAvailability).length > 0
                    ? 'Créneaux de 1h disponibles selon les horaires du pro'
                    : !isUserA
                      ? 'Créneaux de 1h disponibles (minimum 1h après maintenant)'
                      : 'Créneaux de 1h disponibles entre 7h et 20h'
                  : !isUserA && date && parseDateLocal(date).toDateString() === new Date().toDateString()
                    ? 'Aucun créneau disponible aujourd\'hui. Veuillez sélectionner un jour ultérieur.'
                    : 'Sélectionnez d\'abord une date'
                }
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!date || !time}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proposer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
