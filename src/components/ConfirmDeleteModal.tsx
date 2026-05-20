import { X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = "Supprimer",
  cancelText = "Annuler",
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="modal-bg-confirm-delete bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800 pr-8">{title}</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
