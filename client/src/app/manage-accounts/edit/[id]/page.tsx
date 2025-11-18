"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AccountsService, Account } from "@/services/accountsService";
import { useAuth } from "@/contexts/authContext";
import Link from "next/link";
import Loading from "@/components/loading";
import { useAuth } from "@/contexts/authContext";
import EditAccount from "@/components/editAccount";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AccountsService, Account } from "@/services/accountsService";

export default function ManageAccountsEditId() {
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
        content = account ? <EditAccount account={account} id={id} /> : null;
    }

    return (
        <main>
            <h1 className="page-title">Manage accounts - Edit</h1>

            {content}

            <Link href="/manage-accounts">← Back to accounts</Link>
        </main>
    );
}
