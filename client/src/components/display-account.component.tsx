/**
 * @file displayAccount.tsx
 * @brief EpiCalendar file: displayAccount.tsx
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Account, AccountsService } from "@/services/accounts.service";

export default function DisplayAccount({
    account,
    profile,
}: {
    account: Account;
    profile?: boolean;
}) {
    const router = useRouter();

    const { user, loading } = useAuth();

    const [error, setError] = useState("");

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
            router.push("/manage-accounts");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while deleting the account.",
            );
        }
    };

    if (loading) {
        return;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
            {/* Top card: avatar + actions */}
            <div
                className="card"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={account?.photo || "/default-user.jpg"}
                    alt="User Photo"
                    className="profile-avatar-lg"
                />
                <div style={{ flex: 1 }}>
                    <div
                        className="page-title"
                        style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}
                    >
                        {account?.first_name} {account?.last_name}
                    </div>
                    <div style={{ marginBottom: "0.75rem" }}>
                        <a
                            href={`mailto:${account?.email}`}
                            className="auth-link"
                        >
                            {account?.email}
                        </a>
                    </div>
                    <span className="badge badge-primary">
                        {account?.role?.toUpperCase() || "NO ROLE"}
                    </span>
                </div>
                <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                    {profile ? (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => router.push("/profile/edit")}
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                                router.push(
                                    `/manage-accounts/edit/${account?._id}`,
                                )
                            }
                        >
                            Edit
                        </button>
                    )}
                    {account && !profile && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteAccount(account._id!)}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Info card */}
            <div className="card">
                <h3
                    className="section-title"
                    style={{ fontSize: "1rem", marginBottom: "1rem" }}
                >
                    Account Details
                </h3>

                {user?.role === "admin" && (
                    <>
                        <div className="info-row">
                            <span className="info-label">ID</span>
                            <span
                                className="info-value"
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {account?._id}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Created</span>
                            <span className="info-value">
                                {account?.created_at
                                    ? new Date(
                                          account.created_at,
                                      ).toLocaleDateString("fr-FR", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      })
                                    : "Unknown"}
                            </span>
                        </div>
                    </>
                )}

                <div className="info-row">
                    <span className="info-label">Description</span>
                    <span className="info-value">
                        {account?.description || "No description provided."}
                    </span>
                </div>

                <div className="info-row">
                    <span className="info-label">Preferred Day</span>
                    <span className="info-value">
                        {account?.day || "Not set"}
                    </span>
                </div>

                <div className="info-row">
                    <span className="info-label">Preferred Room</span>
                    <span className="info-value">
                        {account?.room || "Not set"}
                    </span>
                </div>
            </div>

            {/* Guard time */}
            {account?.guard_time && (
                <div className="card">
                    <h3
                        className="section-title"
                        style={{ fontSize: "1rem", marginBottom: "1rem" }}
                    >
                        Guard Time
                    </h3>
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Mon</th>
                                    <th>Tue</th>
                                    <th>Wed</th>
                                    <th>Thu</th>
                                    <th>Fri</th>
                                    <th>Sat</th>
                                    <th>Sun</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{account.guard_time.monday || "0h"}</td>
                                    <td>
                                        {account.guard_time.tuesday || "0h"}
                                    </td>
                                    <td>
                                        {account.guard_time.wednesday || "0h"}
                                    </td>
                                    <td>
                                        {account.guard_time.thursday || "0h"}
                                    </td>
                                    <td>{account.guard_time.friday || "0h"}</td>
                                    <td>
                                        {account.guard_time.saturday || "0h"}
                                    </td>
                                    <td>{account.guard_time.sunday || "0h"}</td>
                                    <td>
                                        <strong>
                                            {account.guard_time.total || "0h"}
                                        </strong>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
