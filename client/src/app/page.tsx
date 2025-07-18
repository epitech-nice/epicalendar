"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/authContext';



export default function Home() {
    const { isAuthenticated, logout, user } = useAuth();


   //if (loading)
   //    return (// TODO: faire un composant de chargement
   //        <main>
   //            <h1>Loading...</h1>
   //        </main>
   //    )



    return (
        <main>
            <nav>
                {!isAuthenticated ? (
                    <div>
                        <Link href="/login">
                            Sign In
                        </Link>
                        <Link href="/register">
                            Sign Up
                        </Link>
                    </div>
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
            <h1>EpiCalendar</h1>
        </main>
    );
}
