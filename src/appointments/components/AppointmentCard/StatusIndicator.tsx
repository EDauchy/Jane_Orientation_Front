export const STATUS_DOT: Record<string, string> = {
  CONFIRMED: "bg-green-500",
  COMPLETED: "bg-gray-400",
  PENDING: "bg-yellow-400 animate-pulse",
  RESCHEDULED: "bg-orange-400",
  CANCELLED: "bg-red-500",
};

export const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "bg-green-100  text-green-800",
  COMPLETED: "bg-gray-100   text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  RESCHEDULED: "bg-orange-100 text-orange-800",
  CANCELLED: "bg-red-100    text-red-800",
};

export const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmé",
  COMPLETED: "Terminé",
  PENDING: "En attente",
  RESCHEDULED: "Reprogrammé",
  CANCELLED: "Annulé",
};

interface StatusIndicatorProps {
  status: string;
  /** 'badge' renders a pill with text; 'dot' renders a small colored circle */
  display?: "badge" | "dot";
}

export default function StatusIndicator({
  status,
  display = "badge",
}: StatusIndicatorProps) {
  const label = STATUS_LABEL[status] ?? status;

  if (display === "dot") {
    return (
      <div
        className={`cursor-pointer w-2.5 h-2.5 shrink-0 rounded-full ${STATUS_DOT[status] ?? "bg-gray-400"}`}
        title={label}
      />
    );
  }

  return (
    <div
      className={`px-2 mr-5 py-0.5 rounded text-xs font-bold shrink-0 ${STATUS_BADGE[status] ?? "bg-red-100 text-red-800"}`}
    >
      {status}
    </div>
  );
}
