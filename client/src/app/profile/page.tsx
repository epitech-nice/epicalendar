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
import Link from "next/link";
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
        content = <div className="error">{error}</div>;
    } else {
        content = account ? (
            <DisplayAccount account={account} profile={true} />
        ) : null;
    }

    return (
        <main>
            <h1 className="page-title">My profile</h1>

            {content}

            <Link href="/">← Back to home</Link>
        </main>
    );
}
