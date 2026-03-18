import React, { useEffect, useState } from 'react';
import type { Professional } from './FindPro';
import { IoMdMail } from "react-icons/io";
import { BiCalendar } from "react-icons/bi"; // calendar icon
import { supabase } from '../lib/supabase';
import FindProSingle from './FindProSignle';

interface ProCardProps {
    pro: Professional;
}

const ProCard: React.FC<ProCardProps> = ({ pro }) => {
    const [open, setOpen] = useState(false);
    const [userAppointments, setUserAppointments] = useState<any[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Fetch user appointments on mount
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;

                const res = await fetch('/api/appointments', {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserAppointments(data.appointments || []);
                }
            } catch (error) {
                console.error('Error fetching appointments', error);
            } finally {
                setLoadingAppointments(false);
            }
        };

        fetchAppointments();
    }, []);

    // Find active appointment for this professional
    const appointment = userAppointments.find(a =>
        a.user_b_id === pro.id &&
        ['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(a.status)
    );

    const appointmentDateStr = appointment?.date;

    return (
        <div className="p-4 bg-white rounded-3xl shadow-md w-full max-w-[300px] flex flex-col gap-3 items-center">
            {/* Avatar & Mail */}
            <div className='relative'>
                <div className="flex justify-center items-center absolute top-0 left-0 z-10 w-[35px] h-[35px] bg-white rounded-br-[10px]">
                    <IoMdMail className="text-primary text-xl" />
                </div>
                <div className="absolute left-0 top-0 w-[10px] h-[45px] bg-[radial-gradient(circle_at_bottom_right,transparent_10px,#ffffff_10px)]"></div>
                <div className="absolute left-0 top-0 w-[45px] h-[10px] bg-[radial-gradient(circle_at_bottom_right,transparent_10px,#ffffff_10px)]"></div>
                <img src={pro.avatar_url} className='rounded-2xl aspect-square object-cover' />
            </div>

            {/* Name & Profession */}
            <div className='flex flex-col gap-1 items-center w-full max-w-[240px]'>
                <p className="font-extrabold text-primary self-center">
                    {pro.first_name} {pro.last_name}
                </p>
                <p className="rounded-full py-1 px-3 bg-primary text-white font-medium">
                    {pro.user_b_details.profession}
                </p>
            </div>

            {/* Appointment Status / Dummy Date Picker */}
            <div className='bg-white rounded-2xl w-full max-w-[250px] shadow-md'>
                <div className='bg-secondary text-white rounded-t-2xl p-2 text-center'>Date du rendez-vous</div>

                {loadingAppointments ? (
                    <div className="p-3 text-center text-gray-500">Chargement...</div>
                ) : appointmentDateStr ? (
                    <div className="flex items-center justify-center p-2 gap-2">
                        <BiCalendar className="text-primary text-lg" />
                        <span className="text-gray-700 font-bold">
                            {new Date(appointmentDateStr).toLocaleString()}
                        </span>
                    </div>
                ) : (
                    <div
                        className="flex items-center gap-2 p-2 cursor-pointer rounded-2xl mt-1 hover:bg-gray-50 transition-colors"
                        onClick={handleOpen}
                    >
                        <BiCalendar className="text-gray-400 text-lg" />
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none focus:outline-none text-gray-500 cursor-pointer"
                            placeholder="Sélectionner une date"
                            readOnly
                        />
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <FindProSingle professional={pro} open={open} onClose={handleClose} />
        </div>
    );
};

export default ProCard;