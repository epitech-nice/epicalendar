"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';



export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { register } = useAuth();



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const registerData = {
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
            };
            await register(registerData);
            router.push('/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <main>
            <div>
                <h1>
                    Sign Up
                </h1>

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
                    </div>

                    <div>
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
                            placeholder="Votre mot de passe"
                        />
                    </div>

                    {error && (
                        <div>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}>
                        {loading ? 'Creating...' : 'Create account'}
                    </button>
                </form>

                <div>
                    <p>
                        Already have an account?{' '}
                        <Link href="/login">
                            Sign in
                        </Link>
                    </p>
                </div>

                <div>
                    <Link href="/">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}