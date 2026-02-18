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
                <div style={{ marginBottom: "1.5rem" }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push(`/manage-accounts/add`)}
                    >
                        + Add Account
                    </button>
                </div>

                <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
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
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="empty-state">
                                            No accounts found.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                accounts.map((account) => (
                                    <tr
                                        key={account._id}
                                        onClick={() =>
                                            router.push(
                                                `/manage-accounts/display/${account._id}`,
                                            )
                                        }
                                    >
                                        <td>{account.email}</td>
                                        <td>{account.first_name}</td>
                                        <td>{account.last_name}</td>
                                        <td>
                                            <span className="badge badge-primary">
                                                {account.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <button
                                                    className="btn btn-secondary btn-sm"
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
                                                    className="btn btn-danger btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAccount(
                                                            account._id!,
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <main className="page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <div className="page-header-left">
                        <h1 className="page-title">Manage Accounts</h1>
                        <p className="page-subtitle">
                            Admin — all registered users
                        </p>
                    </div>
                    <Link href="/" className="back-link">
                        ← Back to home
                    </Link>
                </div>

                {content}
            </div>
        </main>
    );
}
