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
import {
    OpeningRequest,
    OpeningRequestsService,
} from "@/services/opening-requests.service";
import Loading from "@/components/ui/loading.component";
<<<<<<< HEAD
import Link from "next/link";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { useState, useEffect, useCallback } from "react";
=======
>>>>>>> d703b80 (REFACTOR: Refactor UI components for improved styling and consistency)

export default function ManageOpeningRequests() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const [openingRequests, setOpeningRequests] = useState<OpeningRequest[]>(
        [],
    );
    const [error, setError] = useState<string | null>("");

    const fetchOpeningRequests = useCallback(async () => {
        try {
            const fetchedOpeningRequests =
                await OpeningRequestsService.getOpeningRequests();
            setOpeningRequests(fetchedOpeningRequests);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching opening requests.",
            );
        }
    }, []);

    const handleDeleteOpeningRequests = async (openingRequestsId: string) => {
        console.log(
            "Attempting to delete opening requests with ID:",
            openingRequestsId,
        );

        if (
            !confirm(
                "Are you sure you want to delete this opening request? This action cannot be undone.",
            )
        ) {
            return;
        }

        try {
            await OpeningRequestsService.deleteOpeningRequest(
                openingRequestsId,
            );
            await fetchOpeningRequests();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while deleting the opening request.",
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

        if (!user) {
            setError("You do not have permission to access this page.");
            return;
        }

        fetchOpeningRequests();
    }, [isAuthenticated, loading, user, router, fetchOpeningRequests]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <div className="error-message">{error}</div>;
    } else {
        content = (
            <div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push(`/opening-requests/add`)}
                    >
                        + New Request
                    </button>
                </div>

                <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                {user?.role !== "student" && <th>Account</th>}
                                <th>Opens at</th>
                                <th>Closes at</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {openingRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={user?.role !== "student" ? 6 : 5}>
                                        <div className="empty-state">No opening requests found.</div>
                                    </td>
                                </tr>
                            ) : openingRequests.map((openingRequest) => (
                                <tr
                                    key={openingRequest._id}
                                    onClick={() => router.push(`/opening-requests/display/${openingRequest._id}`)}
                                >
                                    <td>
                                        {new Date(openingRequest.date).toLocaleDateString("fr-FR", {
                                            year: "numeric", month: "2-digit", day: "2-digit",
                                        })}
                                    </td>
                                    {user?.role !== "student" && (
                                        <td>{openingRequest.account}</td>
                                    )}
                                    <td>
                                        {new Date(openingRequest.open).toLocaleTimeString("fr-FR", {
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </td>
                                    <td>
                                        {new Date(openingRequest.close).toLocaleTimeString("fr-FR", {
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            openingRequest.status === "approved" ? "badge-success" :
                                            openingRequest.status === "rejected" ? "badge-error" :
                                            "badge-neutral"
                                        }`}>
                                            {openingRequest.status?.toUpperCase() || "PENDING"}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/opening-requests/edit/${openingRequest._id}`);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteOpeningRequests(openingRequest._id!);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                        <h1 className="page-title">Opening Requests</h1>
                        <p className="page-subtitle">Request and manage campus opening hours</p>
                    </div>
                    <a href="/" className="back-link">← Back to home</a>
                </div>

                {content}
            </div>
        </main>
    );
}
