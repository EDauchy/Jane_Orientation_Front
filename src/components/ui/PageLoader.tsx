import { Loader2 } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-[6px] flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-primary animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
      </div>
      <p className="text-sm font-medium text-primary/60 tracking-wide uppercase">
        Chargement
      </p>
    </div>
  );
}
