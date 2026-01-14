import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  onDateSelect
}: AvailableDatePickerProps) {

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  };

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

    const dayName = getDayName(date);
    return !!availability[dayName];
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];

    const firstDayOfWeek = firstDay.getDay();
    const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateForValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateLocal = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date)) {
      onDateSelect(formatDateForValue(date));
      setIsOpen(false);
    }
  };

  const days = getDaysInMonth();
  const monthYear = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const selectedDateObj = selectedDate ? parseDateLocal(selectedDate) : null;

  const calendarStyle: React.CSSProperties = buttonRect ? {
    position: 'fixed',
    top: buttonRect.bottom + 8,
    left: buttonRect.left,
    minWidth: Math.max(buttonRect.width, 300),
  } : {};

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
      >
        <span className={selectedDateObj ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDateObj ? formatDateForDisplay(selectedDateObj) : 'Sélectionner une date'}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-60"
            onClick={() => setIsOpen(false)}
          />
          {buttonRect && (
            <div
              className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-70"
              style={calendarStyle}
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Mois précédent"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="font-semibold text-sm capitalize text-gray-900">{monthYear}</span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Mois suivant"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-gray-500 py-1.5">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} />;
                  }

                  const available = isDateAvailable(date);
                  const isSelected = selectedDateObj &&
                    formatDateForValue(date) === formatDateForValue(selectedDateObj);

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
                          : 'text-gray-300 cursor-not-allowed bg-gray-50/50'
                        }
                        ${isSelected
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                          : available ? 'text-gray-700' : ''
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              {availability && Object.keys(availability).length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded-sm" />
                    <span>Jours non disponibles</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
