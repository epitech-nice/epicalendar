"use client";

/**
 * @file page.tsx
 * @brief EpiCalendar — web application to manage schedules, opening requests,
 * accounts and presence for Epitech students and staff. Offers calendar
 * views, account management, day management, opening-requests workflow,
 * image uploads, and integrations with the Epitech intranet and Office365.
 * Built with Next.js, React, TypeScript, Tailwind CSS and a Node.js backend.
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Button, Input, Card, Alert, Container } from "@/components/ui";

export default function Login() {
    const router = useRouter();

    const { isAuthenticated, login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
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
            await login(formData);
            router.push("/");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred during login.",
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
        <main className="min-h-screen flex items-center justify-center py-12">
            <Container maxWidth="sm">
                <div className="mb-8">
                    <h1 className="page-title">Sign In</h1>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                        />

                        <Input
                            type="password"
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Your password"
                        />

                        {error && (
                            <Alert type="error">{error}</Alert>
                        )}

                        <Button
                            type="submit"
                            disabled={responseLoading}
                            className="w-full"
                        >
                            {responseLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-text-secondary">
                        <p>
                            Don&#39;t have an account?{" "}
                            <Link href="/register" className="text-primary hover:text-primary-dark font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/" className="text-text-tertiary hover:text-primary text-sm">
                            ← Back to home
                        </Link>
                    </div>
                </Card>
            </Container>
        </main>
    );
}
