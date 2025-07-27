"use client";

import {useCallback, useEffect, useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import {Day, DaysService} from '@/services/daysService';
import Loading from "@/components/loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Account, AccountsService} from "@/services/accountsService";



export default function ManageDaysAdd() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth()

    const [aers, setAers] = useState<Account[]>([]);
    const [formData, setFormData] = useState<Day>({
        date: new Date(),
        open: new Date(),
        start: new Date(),
        close: new Date(),
        aers: [],
        message: '',
    });
    const [preset, setPreset] = useState<string>('Custom');
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState('');



    const fetchAers = useCallback(async () => {
        try {
            const aersData = await AccountsService.getAers();
            setAers(aersData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching the account.')
        }
    }, []);

    function getHours(hours: number, minutes: number): Date {
        const newDate = new Date(Date.now());
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }

    const handlePreset = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const selected = e.target.value;
        setPreset(selected);

        if (selected === 'Normal') {
            setFormData(prev => ({
                ...prev,
                open: getHours(8, 0),
                start: getHours(18, 0),
                close: getHours(22, 0),
            }));
        } else if (selected === 'Pool') {
            setFormData(prev => ({
                ...prev,
                open: getHours(8, 0),
                start: getHours(18, 0),
                close: getHours(23, 42),
            }));
        } else if (selected === 'Summer') {
            setFormData(prev => ({
                ...prev,
                open: getHours(8, 0),
                start: getHours(18, 0),
                close: getHours(20, 0),
            }));
        } else if (selected === 'Week-end') {
            setFormData(prev => ({
                ...prev,
                open: getHours(10, 0),
                start: getHours(10, 0),
                close: getHours(20, 0),
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name: keyof Day, value: Date | null) => {
        if (!value) return;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAerChange = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = (e.target as HTMLInputElement).value.trim();
            const aer = aers.find(a => a.email === input);

            if (!aer) {
                setError("No AER found with that email.");
                return;
            }

            if (formData.aers && formData.aers.includes(aer._id!)) {
                setError("This AER is already added.");
                return;
            }

            setFormData(prev => ({
                ...prev,
                aers: [...(prev.aers || []), aer._id!]
            }));

            (e.target as HTMLInputElement).value = '';
        }
    }

    const handleDeleteAer = (id: string) => {
        setFormData(prev => ({
            ...prev,
            aers: prev.aers ? prev.aers.filter(aerId => aerId !== id) : []
        }));
    }

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

        if (!user || user.role === 'student') {
            setError('You do not have permission to access this page.');
            return;
        }

        fetchAers();
    }, [isAuthenticated, loading, user, router, fetchAers]);



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
                    </label><
                    DatePicker
                        selected={formData.date}
                        onChange={(date) => handleDateChange("date", date)}
                        dateFormat="dd-MM-yyyy"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="preset">Preset</label>
                    <select
                        id="preset"
                        name="preset"
                        value={preset}
                        onChange={handlePreset}
                    >
                        <option value="Custom">Custom</option>
                        <option value="Normal">Normal (8h–18h–22h)</option>
                        <option value="Pool">Pool (8h–18h–23h42)</option>
                        <option value="Summer">Summer (8h–18h–20h)</option>
                        <option value="Week-end">Week-end (10h–10h–20h)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="open">
                        Campus opens at
                    </label>
                    <DatePicker
                        selected={formData.open}
                        onChange={(date) => handleDateChange("open", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Open"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                    <label htmlFor="start">
                        Guard start at
                    </label>
                    <DatePicker
                        selected={formData.start}
                        onChange={(date) => handleDateChange("start", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Start"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                    <label htmlFor="close">
                        Campus closes at
                    </label>
                    <DatePicker
                        selected={formData.close}
                        onChange={(date) => handleDateChange("close", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Close"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                </div>

                <div>
                    <label>
                        AER list
                    </label>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Total guard time</th>
                                <th>Preferred day</th>
                            </tr>
                        </thead>

                        <tbody>
                            {aers.map(aer => (
                                <tr key={aer._id}>
                                    <td>
                                        {aer.email}
                                    </td>

                                    <td>
                                        {aer.first_name} {aer.last_name}
                                    </td>

                                    <td>
                                        {aer.guard_time ? `${aer.guard_time.total}` : 'N/A'}
                                    </td>

                                    <td>
                                        {aer.day || ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <label htmlFor="aerInput">Add AER by email</label>
                    <input
                        type="text"
                        id="aerInput"
                        list="aerOptions"
                        onKeyDown={handleAerChange}
                        placeholder="Enter AER email and press Enter"
                    />
                    <datalist id="aerOptions">
                        {aers.map(aer => (
                            <option key={aer._id} value={aer.email}/>
                        ))}
                    </datalist>
                </div>

                <div>
                    {formData.aers && formData.aers.map(id => {
                        const aer = aers.find(a => a._id === id);
                        if (!aer)
                            return null;
                        return (
                            <div key={id}>
                                <span>{aer.first_name} {aer.last_name}</span>
                                <button onClick={() => handleDeleteAer(id)}>
                                    ❌
                                </button>
                            </div>
                        );
                    })}
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

                {error && (
                    <div>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={responseLoading}
                >
                    {responseLoading ? 'Adding...' : 'Add day'}
                </button>
            </form>
        );
    }



    return (
        <main>
            <h1>
                Manage days - Add day
            </h1>

            {content}

            <Link href="/manage-days">
                ← Back to days
            </Link>
        </main>
    )
}
