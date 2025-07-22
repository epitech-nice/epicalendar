"use client";

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import {Day, DaysService} from '@/services/daysService';
import Loading from "@/components/loading";



export default function ManageDaysAdd() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth()

    const [formData, setFormData] = useState<Day>({
        date: new Date(),
        start: new Date(),
        start_at: new Date(),
        end: new Date(),
        aer: [],
        message: '',
    });
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState('');



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'date') {
            setFormData(prev => ({
                ...prev,
                [name]: new Date(value + 'T' + prev[name as keyof Day].toTimeString().split(' ')[0])
            }));
        } else if (type === 'time') {
            // Fusionne la nouvelle heure avec la date actuelle de l'objet
            const [hours, minutes] = value.split(':').map(Number);
            const oldDate = new Date(formData[name as keyof Day] as Date);
            const updated = new Date(oldDate);
            updated.setHours(hours);
            updated.setMinutes(minutes);
            updated.setSeconds(0);
            updated.setMilliseconds(0);

            setFormData(prev => ({
                ...prev,
                [name]: updated
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError('');

        try {
            await DaysService.addDay(formData);
            router.push('/manage-days');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred while adding the day.');
        } finally {
            setResponseLoading(false);
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
    }, [isAuthenticated, loading, user, router]);



    let content = null;

    if (loading) {
        content = (
            <Loading/>
        )

    } else {
        content = (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="date">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date.toISOString().split('T')[0]}
                        onChange={handleChange}
                        required
                        placeholder="Select a date"
                    />
                </div>

                <div>
                    <label htmlFor="start">
                        Start time
                    </label>
                    <input
                        type="time"
                        id="start"
                        name="start"
                        value={formData.start.toTimeString().split(' ')[0]}
                        onChange={handleChange}
                        required
                        placeholder="Start time"
                    />
                    <label htmlFor="start_at">
                        Start at
                    </label>
                    <input
                        type="time"
                        id="start_at"
                        name="start_at"
                        value={formData.start_at.toTimeString().split(' ')[0]}
                        onChange={handleChange}
                        required
                        placeholder="Start at"
                    />
                    <label htmlFor="end">
                        End time
                    </label>
                    <input
                        type="time"
                        id="end"
                        name="end"
                        value={formData.end.toTimeString().split(' ')[0]}
                        onChange={handleChange}
                        required
                        placeholder="End time"
                    />
                </div>

                <div>
                    <label htmlFor="message">
                        Optional message
                    </label>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="A informative message for the day"
                    />
                </div>

                {/*<div>
                    <label htmlFor="aer">
                        AERs
                    </label>
                    <input
                        type="text"
                        id="aer"
                        name="aer"
                        value={formData.aer.join(', ')}
                        onChange={(e) => handleChange({
                            target: {
                                name: 'aer',
                                value: e.target.value.split(',').map(item => item.trim())
                            }
                        })}
                        placeholder="Comma separated list of AERs"
                    />
                </div>*/}

                {error && (
                    <div>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={responseLoading}
                >
                    {responseLoading ? 'Adding...' : 'Add Day'}
                </button>
            </form>
        );
    }



    return (
        <main>
            <div>
                <h1>
                    Manage days - Add day
                </h1>

                {content}

                <Link href="/manage-days">
                    ← Back to days
                </Link>
            </div>
        </main>
    )
}
