"use client";

import Link from "next/link";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Account } from "@/services/accountsService";
import { useCallback, useEffect, useState } from "react";
import DisplayAccount from "@/components/displayAccount";
import { ProfileService } from "@/services/profileService";

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
