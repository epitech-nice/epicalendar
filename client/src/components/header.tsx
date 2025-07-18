"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';



export default function Header() {
    const { isAuthenticated, logout, user } = useAuth();



    return (
        <header>
            {/* Logo */}
            <Link href="/">
                <Image
                    src="/favicon.ico"
                    alt="EpiCalendar Logo"
                    width={32}
                    height={32}
                />
                <span>EpiCalendar</span>
            </Link>

            {/* Other pages */}
            {isAuthenticated && user && (
                <nav>
                    <Link href="/activities">
                        Calendar
                    </Link>
                    <Link href="/request">
                        Opening request
                    </Link>
                    <Link href="/suck">
                        I&#39;m stuck
                    </Link>
                    {['aer', 'admin'].includes(user.role) && (
                        <>
                            <Link href="/manage-requests">
                                Manage requests
                            </Link>
                            <Link href="/manage-guards">
                                Manage guards
                            </Link>
                            <Link href="/profile">
                                Profile
                            </Link>
                        </>
                    )}
                    {user.role === 'admin' && (
                        <Link href="/manage-accounts">
                            Manage accounts
                        </Link>
                    )}
                </nav>
            )}

            {/* Connection */}
            <nav>
                {!isAuthenticated ? (
                    <>
                        <Link href="/login">
                            Sign In
                        </Link>
                        <Link href="/register">
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <div>
                        {user && (
                            <span>
                                {user.first_name} {user.last_name} ({user.role})
                            </span>
                        )}
                        <button onClick={logout}>
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}
