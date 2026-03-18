import { useLocation, Link } from 'react-router-dom';

interface NavDashboardProps {
  to: string;
  iconSrc: string;
  title: string;
  subtitle: string;
  state?: any; // Ajout de la prop state pour conserver le backgroundLocation
}

export default function NavDashboard({ to, iconSrc, title, subtitle, state }: NavDashboardProps) {
  const location = useLocation();
  

  const isActive = location.pathname === to; 

  return (
    <Link
      to={to}
      state={state}
      className={`
        flex items-center gap-3 md:p-3 p-2 md:rounded-3xl rounded-2xl text bg-white text-primary transition border-2
        ${isActive ? 'border-primary' : 'border-gray-200'} 
        hover:bg-black/5 
      `}
    >
      <div className="bg-primary rounded-xl p-2 shrink-0">
        <img src={iconSrc} className="w-6 md:w-10" alt={title} />
      </div>
      <div className="lg:flex flex-col overflow-hidden hidden">
        <span className="font-bold leading-tight truncate">{title}</span>
        <span className="text-xs font-medium opacity-70 truncate">{subtitle}</span>
      </div>
    </Link>
  );
}