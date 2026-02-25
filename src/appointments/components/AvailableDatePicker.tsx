import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaCalendarAlt } from 'react-icons/fa';
import Popover from '@mui/material/Popover';

interface AvailableDatePickerProps {
  availability: Record<string, string[]> | null;
  minDate?: string;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

export default function AvailableDatePicker({
  availability,
  minDate,
  selectedDate,
  onDateSelect,
}: AvailableDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOpen = Boolean(anchorEl);
  const openPopover = () => setAnchorEl(buttonRef.current);
  const closePopover = () => setAnchorEl(null);

  // ─── Date helpers ─────────────────────────────────────────────────────────

  const getDayName = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return false;
    }

    if (!availability || Object.keys(availability).length === 0) return true;

    return !!availability[getDayName(date)];
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];
    const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));

    return days;
  };

  const formatDisplay = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${date.getFullYear()}`;
  };

  const formatValue = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const parseDateLocal = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  // ─── Interactions ─────────────────────────────────────────────────────────

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return;
    onDateSelect(formatValue(date));
    closePopover();
  };

  const days = getDaysInMonth();
  const monthYear = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const selectedDateObj = selectedDate ? parseDateLocal(selectedDate) : null;

  return (
    <div className="relative w-full">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={isOpen ? closePopover : openPopover}
        className="w-full cursor-pointer input-base"
      >
        <span className={selectedDateObj ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDateObj ? formatDisplay(selectedDateObj) : 'JJ/MM/AAAA'}
        </span>
        <FaCalendarAlt className="text-primary text-lg" />
      </button>

      {/* MUI Popover calendar */}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              mt: 0.5,
            },
          },
        }}
      >
        <div className="p-4 w-[280px]">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-sm capitalize text-gray-900">{monthYear}</span>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center text-xs font-semibold text-gray-500 py-1.5">
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} />;

              const available = isDateAvailable(date);
              const isSelected = selectedDateObj && formatValue(date) === formatValue(selectedDateObj);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  disabled={!available}
                  className={`
                    w-9 h-9 text-sm rounded-lg transition-all font-medium
                    ${available
                      ? 'hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer'
                      : 'text-gray-300 cursor-not-allowed bg-gray-50/50'}
                    ${isSelected
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      : available ? 'text-gray-700' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          {availability && Object.keys(availability).length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded" />
                <span>Jours non disponibles</span>
              </div>
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
}