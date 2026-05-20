import { useLocation, useNavigate } from 'react-router-dom';
import NavDashboard from './NavDashboard';

import { useAuth } from '../../context/AuthContext';


interface NavItem {
  to: string;
  iconSrc: string;
  title: string;
  subtitle: string;
  allowedRoles?: string[]; 
}

const navLinks: NavItem[] = [
  {
    to: "/mydashboard",
    iconSrc: "/dashboard-icon.png",
    title: "Home",
    subtitle: "Vue d'ensemble",
    //allowedRoles: ["admin", "user_reconversion", "user_pro"],
  },
  {
    to: "/mydashboard/maps",
    iconSrc: "/dashboard-maps.png",
    title: "Maps",
    subtitle: "Gestion switch",
    allowedRoles: ["admin", "user_reconversion"],
  },
  {
    to: "/mydashboard/account",
    iconSrc: "/dashboard-user.png",
    title: "Compte",
    subtitle: "Mes infos",
  },
     {
    to: "/mydashboard/security",
    iconSrc: "/dashboard-securite.png",
    title: "Sécurité",
    subtitle: "Mot de passe",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut} = useAuth();
  
  const previousPage = location.state?.backgroundLocation?.pathname || "/";

  const handleClose = () => {
     navigate(previousPage, { replace: true });
  };
  const background = location.state?.backgroundLocation;

  const userRole = user?.user_metadata?.role ?? user?.role;

const visibleLinks = navLinks.filter((link) => {
  if (!link.allowedRoles) return true;
  
  return link.allowedRoles.includes(userRole ?? "");
});


  return (

    <>

      <div className="md:hidden h-15 flex flex-row w-full justify-center gap-2 rounded-2xl rounded-br-none">
        {visibleLinks.map((link) => (
          <NavDashboard
            key={link.to}
            to={link.to}
            state={{ backgroundLocation: background }}
            iconSrc={link.iconSrc}
            title={link.title}
            subtitle={link.subtitle}
          />
        ))}

        <button
          onClick={() => handleClose()}
          className={`
        flex items-center gap-3 p-2 rounded-2xl text bg-white text-primary 
        hover:bg-black/5 border-2 border-white
      `}
          title="Fermer le dashboard"
        >
          <div
            className=" w-10 h-10 bg-primary rounded-[10px] text-white flex items-center justify-center z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3.6}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </button>

        
      <div
  onClick={() => { signOut(); handleClose(); }}
  className='flex items-center gap-3 p-2 rounded-2xl text bg-white text-primary hover:bg-black/5 border-2 border-white cursor-pointer active:scale-90 transition-transform'
>
  <div className='bg-primary w-full h-full rounded-xl p-2 hover:opacity-80 transition-opacity'>
    <img src='/dashboard-logout.png' className="w-6" alt='logout' />
  </div>
</div>


      </div>
      <div className="hidden md:flex flex-col h-[100%] lg:w-[300px]">

        <div className="flex flex-col h-full w-full bg-white rounded-2xl rounded-br-none p-4 space-y-3">
          {visibleLinks.map((link) => (
            <NavDashboard
              key={link.to}
              to={link.to}
              state={{ backgroundLocation: background }}
              iconSrc={link.iconSrc}
              title={link.title}
              subtitle={link.subtitle}
            />
          ))}
        </div>

        <div className="relative flex w-full">
          <div
  onClick={() => { signOut(); handleClose(); }}
  className='absolute w-20 h-20 bottom-0 left-0 bg-white p-3 rounded-3xl cursor-pointer active:scale-90 transition-transform'
>
  <div className='bg-primary w-full h-full rounded-xl p-2 hover:opacity-80 transition-opacity'>
    <img src='/dashboard-logout.png' className="w-10" alt='logout' />
  </div>
</div>
          <div className="absolute left-[74px] top-0 w-[22px] h-[22px] bg-[radial-gradient(circle_at_bottom_left,_transparent_22px,_#ffffff_22px)]" />
          <div className="w-24 h-24" />
          <div className="absolute left-24 right-0 top-0 bottom-0  bg-white rounded-b-2xl" />
        </div>
      </div>
    </>
  )
}