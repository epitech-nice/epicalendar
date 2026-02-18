/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { Account, AccountsService } from "@/services/accounts.service";
import Loading from "@/components/ui/loading.component";
import Link from "next/link";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect, useCallback } from "react";
import { Account, AccountsService } from "@/services/accountsService";

export default function ManageAccounts() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [error, setError] = useState("");

    const fetchAccounts = useCallback(async () => {
        try {
            setAccounts(await AccountsService.getAccounts());
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching accounts.",
            );
        }
    }, []);

    const handleDeleteAccount = async (accountId: string) => {
        console.log("Attempting to delete account with ID:", accountId);

        if (
            !confirm(
                "Are you sure you want to delete this account? This action cannot be undone.",
            )
        ) {
            return;
        }

        try {
            await AccountsService.deleteAccount(accountId);
            await fetchAccounts();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while deleting the account.",
            );
        }
    };

    useEffect(() => {
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

        fetchAccounts();
    }, [isAuthenticated, loading, user, router, fetchAccounts]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <div className="error">{error}</div>;
    } else {
        content = (
            <div>
                <button onClick={() => router.push(`/manage-accounts/add`)}>
                    Add new account
                </button>

                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {accounts.map((account) => (
                            <tr
                                key={account._id}
                                onClick={() =>
                                    router.push(
                                        `/manage-accounts/display/${account._id}`,
                                    )
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <td>{account.email}</td>
                                <td>{account.first_name}</td>
                                <td>{account.last_name}</td>
                                <td>{account.role.toUpperCase()}</td>
                                <td>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(
                                                `/manage-accounts/edit/${account._id}`,
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAccount(account._id!);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <main>
            <h1 className="page-title">Manage accounts</h1>

            {content}

            <Link href="/">← Back to home</Link>
        </main>
    );
}
