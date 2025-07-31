"use client";

import {useEffect, useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';



export default function Login() {
    const router = useRouter();

    const { isAuthenticated, login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState('');



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError('');

        try {
            await login(formData);
            router.push('/');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred during login.');
        } finally {
            setResponseLoading(false);
        }
    };



    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);



    return (
        <main>
            <div>
                <h1 className="page-title">
                    Sign In
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

                    {error && (
                        <div>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={responseLoading}
                    >
                        {responseLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div>
                    <p>
                        Don&#39;t have an account?{' '}
                        <Link href="/register">
                            Sign up
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
