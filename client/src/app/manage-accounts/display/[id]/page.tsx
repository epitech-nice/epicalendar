/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AccountsService, Account } from "@/services/accounts.service";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import Loading from "@/components/ui/loading.component";
import DisplayAccount from "@/components/display-account.component";

export default function ManageAccountsDisplayId() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { user, loading, isAuthenticated } = useAuth();

    const [account, setAccount] = useState<Account | null>(null);
    const [error, setError] = useState("");

    const fetchAccount = useCallback(async () => {
        try {
            const accountData = await AccountsService.getAccountById(id);
            setAccount(accountData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the account.",
            );
        }
    }, [id]);

    useEffect(() => {
        if (!id) {
            setError("Account ID is required.");
            return;
        }

        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (!user || user.role !== "admin") {
            setError("You do not have permission to access this page.");
            return;
        }

        fetchAccount();
    }, [fetchAccount, id, isAuthenticated, loading, router, user]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <div className="error">{error}</div>;
    } else {
        content = account ? <DisplayAccount account={account} /> : null;
    }

    return (
        <main>
            <h1 className="page-title">Manage accounts - Display</h1>

            {content}

            <Link href="/manage-accounts">← Back to accounts</Link>
        </main>
    );
}
