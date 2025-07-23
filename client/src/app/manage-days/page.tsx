"use client";

import {useState, useEffect, useCallback} from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { Day, DaysService } from '@/services/daysService';
import Loading from "@/components/loading";
import Link from "next/link";
import {AccountsService} from "@/services/accountsService";



export default function ManageDays() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const [days, setDays] = useState<Day[]>([]);
    const [error, setError] = useState<string | null>('');



    const fetchDays = useCallback(async () => {
        try {
            const fetchedDays = await DaysService.getDays();
            for (const day of fetchedDays) {
                const aers: string[] = [];
                for (const aerId of day.aer || []) {
                    try {
                        const account = await AccountsService.getAerById(aerId);
                        if (account) {
                            aers.push(`${account.first_name} ${account.last_name}`);
                        } else {
                            console.warn(`AER with ID ${aerId} not found.`);
                        }
                    } catch (err) {
                        console.error(`Error fetching AER with ID ${aerId}:`, err);
                    }
                }
                day.aer = aers;
            }
            setDays(fetchedDays);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching days.');
        }
    }, []);

    const handleDeleteDay = async (dayId: string) => {
        console.log('Attempting to delete day with ID:', dayId);

        if (!confirm('Are you sure you want to delete this day? This action cannot be undone.')) {
            return;
        }

        try {
            await DaysService.deleteDay(dayId);
            await fetchDays();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting the day.');
        }
    };



    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!user || (user && user.role === 'student')) {
            setError('You do not have permission to access this page.');
            return;
        }

        fetchDays();
    }, [isAuthenticated, loading, user, router, fetchDays]);



    let content = null;

    if (loading) {
        content = (
            <Loading/>
        )

    } else if (error) {
        content = (
            <div className="error">
                {error}
            </div>
        )

    } else {
        content = (
            <div>
                <button onClick={() => router.push(`/manage-days/add`)}>
                    Add new day
                </button>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>AER</th>
                            <th>Campus opens at</th>
                            <th>Guard starts at</th>
                            <th>Campus closes at</th>
                            <th>Was closed at</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {days.map(day => (
                            <tr key={day._id} onClick={() => router.push(`/manage-days/display/${day._id}`)} style={{ cursor: 'pointer' }}>
                                <td>
                                    {new Date(day.date).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </td>

                                <td>
                                    {day.aer && day.aer.length > 0 ? day.aer.join(', ') : 'N/A'}
                                </td>

                                <td>
                                    {new Date(day.start).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>

                                <td>
                                    {new Date(day.start_at).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>

                                <td>
                                    {new Date(day.end).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>

                                <td>
                                    {day.closed_at ? new Date(day.closed_at).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) : 'N/A'}
                                </td>

                                <td>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/manage-days/edit/${day._id}`);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteDay(day._id!);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }



    return (
        <main>
            <h1>
                Manage days
            </h1>

            {content}

            <Link href="/">
                ← Back to home
            </Link>
        </main>
    );
}
