"use client";

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import {Account, AccountsService} from '@/services/accountsService';
import ImageUpload from '@/components/imageUpload';
import Loading from "@/components/loading";



export default function ManageAccountsAdd() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth()

    const [formData, setFormData] = useState<Account>({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
        description: '',
        photo: '/default-user.jpg',
        day: '',
        room: '',
    });
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState('');



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUploaded = (imageUrl: string) => {
        setFormData({
            ...formData,
            photo: imageUrl
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError('');

        try {
            await AccountsService.addAccount(formData);
            router.push('/manage-accounts');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred while adding the account.');
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

        if (!user || user.role !== 'admin') {
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
                    <label htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="first_name">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        placeholder="Your first name"
                    />
                    <label htmlFor="last_name">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Your last name"
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Your password"
                    />
                </div>

                <div>
                    <label htmlFor="role">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="student">Student</option>
                        <option value="aer">AER</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div>
                    { formData.photo && (
                        <ImageUpload
                            onImageUploaded={handleImageUploaded}
                            currentImage={"/default-user.jpg"}//formData.photo
                        />
                    )}
                </div>

                <div>
                    <label htmlFor="description">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="A short description of you"
                    />
                </div>

                <div>
                    <label htmlFor="day">
                        Preferred day
                    </label>
                    <select
                        id="day"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                    >
                        <option value=""></option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                    <label htmlFor="room">
                        Preferred room
                    </label>
                    <input
                        type="text"
                        id="room"
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        placeholder="Room name"
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
                    {responseLoading ? 'Adding...' : 'Add Account'}
                </button>
            </form>
        );
    }



    return (
        <main>
            <h1 className="page-title">
                Manage accounts - Add
            </h1>

            {content}

            <Link href="/manage-accounts">
                ← Back to accounts
            </Link>
        </main>
    )
}
