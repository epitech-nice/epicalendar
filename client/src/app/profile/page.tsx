/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import Loading from "@/components/ui/loading.component";
import DisplayAccount from "@/components/display-account.component";
import { ProfileService } from "@/services/profile.service";
import { useRouter } from "next/navigation";
import { Account } from "@/services/accounts.service";

export default function Profile() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const [account, setAccount] = useState<Account | null>(null);
    const [error, setError] = useState("");

    const fetchAccount = useCallback(async () => {
        try {
            const accountData = await ProfileService.getProfile();
            setAccount(accountData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the account.",
            );
        }
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (!user || user.role === "student") {
            setError("You do not have permission to access this page.");
            return;
        }

        fetchAccount();
    }, [fetchAccount, isAuthenticated, loading, router, user]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <div className="error-message">{error}</div>;
    } else {
        content = account ? (
            <DisplayAccount account={account} profile={true} />
        ) : null;
    }

    return (
        <main className="page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <div className="page-header-left">
                        <h1 className="page-title">My Profile</h1>
                        <p className="page-subtitle">Your account information</p>
                    </div>
                    <a href="/" className="back-link">← Back to home</a>
                </div>

                {content}
            </div>
        </main>
    );
}
