"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';
import "./header.css";



export default function Header() {
    const { isAuthenticated, logout, user } = useAuth();



    return (
        <header>
            {/* Logo */}
            <Link href="/" className="home-link">
                <Image
                    width={32}
                    height={32}
                    src="/favicon.ico"
                    alt="EpiCalendar Logo"
                    className="logo"
                />
                <span className="title">EpiCalendar</span>
            </Link>

            {/* Other pages */}
            <nav>
                <Link href="/calendar">
                    Calendar
                </Link>
                <Link href="/opening-requests">
                    Opening requests
                </Link>
                <Link href="/stuck">
                    I&#39;m stuck
                </Link>
                {isAuthenticated && user && (
                    <>
                        {['aer', 'admin'].includes(user.role) && (
                            <>
                                <Link href="/manage-days">
                                    Manage days
                                </Link>
                            </>
                        )}
                        {user.role === 'admin' && (
                            <Link href="/manage-accounts">
                                Manage accounts
                            </Link>
                        )}
                    </>
                )}
            </nav>

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
                        {user && user.role !== "student" && (
                            <Link href="/profile">
                                {user.first_name} {user.last_name} ({user.role}) {/* TODO: enlever l'affichage du role */}
                            </Link>
                        )}
                        {user && user.role === "student" && (
                            <span>
                                {user.first_name} {user.last_name}
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
