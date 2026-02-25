import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  status: string;
  user_a?: {
    first_name: string;
    last_name: string;
  };
  user_b?: {
    first_name: string;
    last_name: string;
  };
}

interface WeeklyCalendarProps {
  appointments: Appointment[];
  userId: string;
}

export default function WeeklyCalendar({ appointments, userId: _userId }: WeeklyCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(today.setDate(diff));
  });

  // Generate 7 days for current week (Monday to Sunday)
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Generate hour slots from 7h to 20h
  const getHourSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 20; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  // Navigate to previous/next week
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  // Get appointments for a specific day and hour
  const getAppointmentsForSlot = (day: Date, hour: number) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === day.getDate() &&
        aptDate.getMonth() === day.getMonth() &&
        aptDate.getFullYear() === day.getFullYear() &&
        aptDate.getHours() === hour
      );
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 border-green-400 text-green-800';
      case 'RESCHEDULED': return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'CANCELLED': return 'bg-gray-100 border-gray-400 text-gray-600';
      case 'COMPLETED': return 'bg-purple-100 border-purple-400 text-purple-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const weekDays = getWeekDays();
  const hourSlots = getHourSlots();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header with week navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Calendrier Hebdomadaire
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Semaine précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-lg font-semibold text-gray-700 min-w-[200px] text-center">
            {weekDays[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>

          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Semaine suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2 text-sm font-semibold text-gray-500">Heure</div>
            {weekDays.map((day, idx) => {
              const isToday = day.getTime() === today.getTime();
              return (
                <div
                  key={idx}
                  className={`p-2 text-center rounded-lg ${
                    isToday ? 'bg-purple-100 text-purple-800' : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="text-xs font-medium">
                    {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold ${isToday ? 'text-purple-600' : ''}`}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="space-y-1">
            {hourSlots.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-1">
                {/* Hour Label */}
                <div className="p-2 text-sm font-medium text-gray-600 flex items-center">
                  {hour}:00
                </div>

                {/* Day Cells */}
                {weekDays.map((day, dayIdx) => {
                  const slotAppointments = getAppointmentsForSlot(day, hour);

                  return (
                    <div
                      key={dayIdx}
                      className="min-h-[60px] border border-gray-200 rounded-lg p-1 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      {slotAppointments.map(apt => {
                        const clientName = apt.user_a
                          ? `${apt.user_a.first_name} ${apt.user_a.last_name}`
                          : 'Client';

                        return (
                          <div
                            key={apt.id}
                            className={`text-xs p-1.5 rounded border-l-2 ${getStatusColor(apt.status)} cursor-pointer hover:shadow-md transition-shadow`}
                            title={`${clientName} - ${apt.status}`}
                          >
                            <div className="font-semibold truncate">{clientName}</div>
                            <div className="text-[10px] opacity-75">{apt.status}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-400"></div>
            <span>En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-400"></div>
            <span>Confirmé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-400"></div>
            <span>Reprogrammé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-400"></div>
            <span>Terminé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-400"></div>
            <span>Annulé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
