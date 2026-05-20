import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import { DashboardProvider } from "../../context/DashboardContext";

export default function MyDashboard() {
  const navigate = useNavigate();
  const location = useLocation();


  const previousPage = location.state?.backgroundLocation?.pathname || "/";

  const handleClose = () => {
    navigate(previousPage, { replace: true });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <DashboardProvider>
      <div
          className="glass-scroll fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"

        onClick={handleClose}
      >
        <div
          className="flex md:flex-row flex-col items-start w-[90%] h-[90%] max-w-6xl gap-5 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />

          <div className="flex-1 w-full bg-white h-full relative rounded-2xl overflow-y-auto">
            <button
              onClick={() => handleClose()}
              className="hidden md:flex absolute top-4 right-4 w-9 h-9 bg-primary hover:scale-110 active:scale-95 transition-transform rounded-full text-white items-center justify-center z-10"
              title="Fermer le dashboard"
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
            </button>
            <Outlet />
          </div>

        </div>
      </div>
    </DashboardProvider>
  );
}