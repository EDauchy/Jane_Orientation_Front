import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  messages?: string[];
  className?: string;
}

/**
 * Composant d'affichage d'erreur pour les formulaires
 * Peut afficher un message unique ou une liste de messages
 */
export default function FormError({
  message,
  messages,
  className = "",
}: FormErrorProps) {
  // Si aucune erreur, ne rien afficher
  if (!message && (!messages || messages.length === 0)) {
    return null;
  }

  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        {message && <p>{message}</p>}
        {messages && messages.length > 0 && (
          <ul className="list-disc list-inside space-y-1">
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/**
 * Version inline pour les erreurs sous les champs
 */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="text-red-400 text-md mt-1 ml-1 animate-in fade-in duration-150">
      {message}
    </p>
  );
}
