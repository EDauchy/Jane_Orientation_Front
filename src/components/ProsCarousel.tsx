import React, { useEffect, useState } from 'react'
import type { Professional } from './FindPro'
import { supabase } from '../lib/supabase'
import { IoMdMail } from "react-icons/io";
import AvailableDatePicker from './AvailableDatePicker';

interface ProsCarouselProps {
    jobs: string[]
}

function ProsCarousel({ jobs }: ProsCarouselProps) {
    const [pros, setPros] = useState<Professional[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedPro, setSelectedPro] = useState<string | null>(null)
    const [userAppointments, setUserAppointments] = useState<any[]>([])
    const [loadingAppointments, setLoadingAppointments] = useState(true)

    useEffect(() => {
        const fetchPros = async () => {
            try {
                setLoading(true)

                // Fetch professionals for ALL jobs in parallel
                const requests = jobs.map(job =>
                    fetch(`/api/professionals?job=${encodeURIComponent(job)}`)
                        .then(res => (res.ok ? res.json() : null))
                )

                const results = await Promise.all(requests)

                // Merge all professionals into one array
                const allPros: Professional[] = results
                    .filter(Boolean)
                    .flatMap(result => result.professionals || [])

                // Remove duplicate professionals by ID
                const uniquePros = Array.from(
                    new Map(allPros.map(pro => [pro.id, pro])).values()
                )

                // Sort alphabetically by full name
                uniquePros.sort((a, b) => {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase()
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase()
                    return nameA.localeCompare(nameB)
                })

                console.log('Fetched professionals:', uniquePros)

                setPros(uniquePros)
            } catch (error) {
                console.error('Error fetching pros', error)
            } finally {
                setLoading(false)
            }
        }

        const fetchUserAppointments = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session?.access_token) return

                const res = await fetch('/api/appointments', {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                })

                if (res.ok) {
                    const data = await res.json()
                    setUserAppointments(data.appointments || [])
                }
            } catch (error) {
                console.error('Error fetching appointments', error)
            } finally {
                setLoadingAppointments(false)
            }
        }

        if (jobs?.length > 0) {
            fetchPros()
        } else {
            setPros([])
            setLoading(false)
        }

        fetchUserAppointments()
    }, [jobs])

    return (
        <div>
            {loading ? (
                <p>Loading professionals...</p>
            ) : pros.length === 0 ? (
                <p>No professionals found.</p>
            ) : (
                <div className="space-y-2">
                    {pros?.map(pro => {
                        const datePart = selectedPro === pro.id && selectedDate ? selectedDate.split('T')[0] : '';
                        return (
                            <div key={pro.id} className="p-4 bg-white rounded-3xl shadow-md w-full max-w-[300px] flex flex-col gap-3 items-center">
                                <div className='relative'>
                                    <div className=" flex justify-center items-center absolute top-0 left-0 z-10 w-[35px] h-[35px] bg-white rounded-br-[10px]">
                                        <IoMdMail className="text-primary text-xl" />
                                    </div>
                                    <div className="absolute left-0 top-0 w-[10px] h-[45px] bg-[radial-gradient(circle_at_bottom_right,transparent_10px,#ffffff_10px)]"></div>{" "}
                                    <div className="absolute left-0 top-0 w-[45px] h-[10px] bg-[radial-gradient(circle_at_bottom_right,transparent_10px,#ffffff_10px)]"></div>{" "}
                                    <img src={pro.avatar_url} className='rounded-2xl aspect-square object-cover' />
                                </div>
                                <div className='flex flex-col gap-1 items-center w-full max-w-[240px]'>
                                    <p className="font-extrabold text-primary self-center">
                                        {pro.first_name} {pro.last_name}
                                    </p>
                                    <p className="rounded-full py-1 px-3 bg-primary text-white font-medium">
                                        {pro.user_b_details.profession}
                                    </p>
                                </div>
                                <div className='bg-white rounded-4xl w-full max-w-[250px] text-sm shadow-md'>
                                    <div className='bg-secondary text-white p-2 rounded-t-3xl text-center'>Choisir une date</div>
                                    <div>
                                        <AvailableDatePicker
                                            availability={pro.user_b_details.availability}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            selectedDate={datePart}
                                            onDateSelect={(date) => {
                                                setSelectedPro(pro.id);
                                                setSelectedDate(`${date}T09:00:00.000Z`);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            )}
        </div>
    )
}

export default ProsCarousel

