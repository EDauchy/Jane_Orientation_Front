import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Close on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close when clicking the backdrop
    >
      <div 
        className=" rounded-xl max-w-4xl w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        onKeyDown={handleKeyDown}
      >
        {/* Close Button Container */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary flex items-center justify-center transition-colors shadow-lg"
            aria-label="Fermer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}