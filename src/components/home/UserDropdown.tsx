import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserDropdownProps } from '../../shard/types';


const UserDropdown: React.FC<UserDropdownProps> = ({ isOpen, setIsOpen }) => {
    const { user, signOut
     } = useAuth(); 
    const location = useLocation();

    if (!isOpen) return null;

    return (
        <div className="absolute top-[110%] right-0 w-[180px] bg-white shadow-xl rounded-xl py-2 z-50 border border-gray-100">
            {user ? (
                /* --- SI CONNECTÉ --- */
                <>
                    <Link
                        to="/mydashboard/account"
                        onClick={() => setIsOpen(false)}
                        className="w-full block text-left px-4 py-3 hover:bg-gray-100 text-gray-700 transition-colors font-medium"
                        state={{ backgroundLocation: location }}
                    >
                        Mon Profil
                    </Link>

                    <Link
                        to="/mydashboard"
                        onClick={() => setIsOpen(false)}
                        className="w-full block text-left px-4 py-3 hover:bg-gray-100 text-gray-700 transition-colors border-t border-gray-50 font-medium"
                        state={{ backgroundLocation: location }}
                    >
                        Dashboard
                    </Link>

                    <button
                        onClick={() => {
                            signOut(); 
                            setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors border-t border-gray-50 font-semibold"
                    >
                        Déconnexion
                    </button>
                </>
            ) : (
                /* --- SI DÉCONNECTÉ --- */
                <>
                    <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full block text-left px-4 py-3 hover:bg-gray-100 text-gray-700 transition-colors font-medium"
                    >
                        Connexion
                    </Link>
                    
                    <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="w-full block text-left px-4 py-3 hover:bg-blue-50 text-blue-600 transition-colors border-t border-gray-50 font-semibold"
                    >
                        S'inscrire
                    </Link>
                </>
            )}
        </div>
    );
};

export default UserDropdown;