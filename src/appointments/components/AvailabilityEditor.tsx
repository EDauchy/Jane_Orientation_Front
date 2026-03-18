import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Clock, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SelectInput from '../../components/SelectInput';

interface AvailabilityEditorProps {
  initialAvailability: Record<string, string[]>;
  open: boolean;
  onClose: () => void;
  onSave: (newAvailability: Record<string, string[]>) => void;
  isRegistration?: boolean;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 560,
  outline: 'none',
  mx: 2,
};

const DAYS = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
];

export default function AvailabilityEditor({
  initialAvailability,
  open,
  onClose,
  onSave,
  isRegistration = false,
}: AvailabilityEditorProps) {
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    initialAvailability || {}
  );
  const [saving, setSaving] = useState(false);

  const handleTimeChange = (
    day: string,
    type: 'start' | 'end',
    value: string
  ) => {
    setAvailability((prev) => {
      const current = prev[day] || ['09:00', '17:00'];
      const newTimes = [...current];

      if (type === 'start') newTimes[0] = value;
      else newTimes[1] = value;

      return { ...prev, [day]: newTimes };
    });
  };

  const toggleDay = (day: string) => {
    setAvailability((prev) => {
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
        onSave(availability);
        onClose();
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="availability-modal-title"
      className="overflow-y-auto"
    >
      <Box sx={modalStyle}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-primary p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <h2
                id="availability-modal-title"
                className="text-xl font-bold uppercase"
              >
                Mes Disponibilités
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full flex items-center justify-center w-9 h-9 bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            {DAYS.map(({ key, label }) => {
              const isOpen = !!availability[key];
              const times = availability[key] || ['09:00', '17:00'];

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${isOpen
                    ? 'border-primary bg-primary/20'
                    : 'border-gray-200 bg-gray-50'
                    }`}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isOpen}
                      onChange={() => toggleDay(key)}
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                    <div
                      className={`font-bold uppercase ${isOpen ? 'text-primary' : 'text-gray-500'
                        }`}
                    >
                      {label}
                    </div>
                  </div>

                  {/* RIGHT */}
                  {isOpen ? (
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectInput
                        label=""
                        value={times[0]}
                        onChange={(e) =>
                          handleTimeChange(key, 'start', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      >
                        {Array.from({ length: 14 }, (_, i) => i + 7).map(
                          (h) => (
                            <option
                              key={h}
                              value={`${h.toString().padStart(2, '0')}:00`}
                            >
                              {h}:00
                            </option>
                          )
                        )}
                      </SelectInput>

                      <span className="text-gray-400">-</span>

                      <SelectInput
                        label=""
                        value={times[1]}
                        onChange={(e) =>
                          handleTimeChange(key, 'end', e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      >
                        {Array.from({ length: 14 }, (_, i) => i + 7).map(
                          (h) => (
                            <option
                              key={h}
                              value={`${h.toString().padStart(2, '0')}:00`}
                            >
                              {h}:00
                            </option>
                          )
                        )}
                      </SelectInput>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Fermé
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button onClick={onClose} className="button-cancel">
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="button-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}