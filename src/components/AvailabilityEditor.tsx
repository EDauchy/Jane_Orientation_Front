import { useState } from 'react';
import { Clock, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AvailabilityEditorProps {
  initialAvailability: Record<string, string[]>;
  onClose: () => void;
  onSave: (newAvailability: Record<string, string[]>) => void;
  isRegistration?: boolean;
}

const DAYS = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

export default function AvailabilityEditor({ initialAvailability, onClose, onSave, isRegistration = false }: AvailabilityEditorProps) {
  const [availability, setAvailability] = useState<Record<string, string[]>>(initialAvailability || {});
  const [saving, setSaving] = useState(false);

  const handleTimeChange = (day: string, type: 'start' | 'end', value: string) => {
    setAvailability(prev => {
      const current = prev[day] || ['09:00', '17:00'];
      const newTimes = [...current];
      if (type === 'start') newTimes[0] = value;
      else newTimes[1] = value;
      return { ...prev, [day]: newTimes };
    });
  };

  const toggleDay = (day: string) => {
    setAvailability(prev => {
      const newAvail = { ...prev };
      if (newAvail[day]) {
        delete newAvail[day];
      } else {
        newAvail[day] = ['09:00', '17:00'];
      }
      return newAvail;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isRegistration) {
        // In registration mode, we just pass the data back to the parent
        // No API call needed yet
        onSave(availability);
        onClose();
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ availability }),
      });

      if (res.ok) {
        onSave(availability);
        onClose();
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <h2 className="text-xl font-bold">Mes Disponibilités</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {DAYS.map(({ key, label }) => {
            const isOpen = !!availability[key];
            const times = availability[key] || ['09:00', '17:00'];

            return (
              <div key={key} className={`flex items-center justify-between p-3 rounded-lg border ${isOpen ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isOpen}
                    onChange={() => toggleDay(key)}
                    className="w-5 h-5 rounded-sm text-purple-600 focus:ring-purple-500"
                  />
                  <span className={`font-medium ${isOpen ? 'text-purple-900' : 'text-gray-500'}`}>{label}</span>
                </div>

                {isOpen && (
                  <div className="flex items-center gap-2">
                    <select
                      value={times[0]}
                      onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                      className="border border-gray-300 rounded-sm px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 outline-hidden"
                    >
                      {Array.from({ length: 14 }, (_, i) => i + 7).map(h => (
                        <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>{h}:00</option>
                      ))}
                    </select>
                    <span className="text-gray-400">-</span>
                    <select
                      value={times[1]}
                      onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                      className="border border-gray-300 rounded-sm px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 outline-hidden"
                    >
                      {Array.from({ length: 14 }, (_, i) => i + 7).map(h => (
                        <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>{h}:00</option>
                      ))}
                    </select>
                  </div>
                )}
                {!isOpen && <span className="text-sm text-gray-400 italic">Fermé</span>}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}
