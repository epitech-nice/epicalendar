/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Button, Input, Alert } from "@/components/ui";

export default function Register() {
    const router = useRouter();

    const { isAuthenticated, register } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
    });
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError("");

        try {
            const registerData = {
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                password: formData.password,
            };
            await register(registerData);
            router.push("/");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred during registration.",
            );
        } finally {
            setResponseLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    return (
        <main className="auth-page">
            <div className="auth-card">
                {/* Header */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 className="auth-title">Sign Up</h1>
                    <p className="auth-subtitle">Create your EpiCalendar account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@epitech.eu"
                    />

                    <Input
                        type="text"
                        label="First Name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        placeholder="Your first name"
                    />

                    <Input
                        type="text"
                        label="Last Name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Your last name"
                    />

                    <Input
                        type="password"
                        label="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Choose a password"
                    />

                    {error && (
                        <Alert type="error" className="mb-4">{error}</Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={responseLoading}
                        className="btn-full btn-lg"
                        style={{ marginTop: '0.5rem' }}
                    >
                        {responseLoading ? "Creating..." : "Create Account"}
                    </Button>
                </form>

                <div className="auth-divider" />

                <p className="auth-footer-text">
                    Already have an account?{" "}
                    <Link href="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>
                <p className="auth-footer-text" style={{ marginTop: '0.5rem' }}>
                    <Link href="/" className="back-link">
                        ← Back to home
                    </Link>
                </p>
            </div>
        </main>
    );
}
