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
import { Day, DaysService } from "@/services/days.service";
import Loading from "@/components/ui/loading.component";
import { AccountsService } from "@/services/accounts.service";

export default function ManageDays() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const [days, setDays] = useState<Day[]>([]);
    const [error, setError] = useState<string | null>("");

    const fetchDays = useCallback(async () => {
        try {
            const fetchedDays = await DaysService.getDays();
            for (const day of fetchedDays) {
                const aers: string[] = [];
                for (const aerId of day.aers || []) {
                    try {
                        const account = await AccountsService.getAerById(aerId);
                        if (account) {
                            aers.push(
                                `${account.first_name} ${account.last_name}`,
                            );
                        } else {
                            console.warn(`AER with ID ${aerId} not found.`);
                        }
                    } catch (err) {
                        console.error(
                            `Error fetching AER with ID ${aerId}:`,
                            err,
                        );
                    }
                }
                day.aers = aers;
            }
            setDays(fetchedDays);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching days.",
            );
        }
    }, []);

    const handleDeleteDay = async (dayId: string) => {
        console.log("Attempting to delete day with ID:", dayId);

        if (
            !confirm(
                "Are you sure you want to delete this day? This action cannot be undone.",
            )
        ) {
            return;
        }

        try {
            await DaysService.deleteDay(dayId);
            await fetchDays();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while deleting the day.",
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

        if (!user || user.role === "student") {
            setError("You do not have permission to access this page.");
            return;
        }

        fetchDays();
    }, [isAuthenticated, loading, user, router, fetchDays]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <div className="error-message">{error}</div>;
    } else {
        content = (
            <div>
                <div style={{ marginBottom: "1.5rem" }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => router.push(`/manage-days/add`)}
                    >
                        + Add Day
                    </button>
                </div>

                <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>AER(s)</th>
                                <th>Opens at</th>
                                <th>Guard starts</th>
                                <th>Closes at</th>
                                <th>Was closed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {days.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state">
                                            No days found.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                days.map((day) => (
                                    <tr
                                        key={day._id}
                                        onClick={() =>
                                            router.push(
                                                `/manage-days/display/${day._id}`,
                                            )
                                        }
                                    >
                                        <td>
                                            {new Date(
                                                day.date,
                                            ).toLocaleDateString("fr-FR", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {day.aers && day.aers.length > 0 ? (
                                                day.aers.join(", ")
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "rgb(var(--color-text-tertiary))",
                                                    }}
                                                >
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(
                                                day.open,
                                            ).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {new Date(
                                                day.start,
                                            ).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {new Date(
                                                day.close,
                                            ).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {day.end ? (
                                                new Date(
                                                    day.end,
                                                ).toLocaleTimeString("fr-FR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                            ) : (
                                                <span
                                                    style={{
                                                        color: "rgb(var(--color-text-tertiary))",
                                                    }}
                                                >
                                                    N/A
                                                </span>
                                            )}
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
                                                            `/manage-days/edit/${day._id}`,
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteDay(
                                                            day._id!,
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
                        <h1 className="page-title">Manage Days</h1>
                        <p className="page-subtitle">
                            Campus opening schedule management
                        </p>
                    </div>
                    <a href="/" className="back-link">
                        ← Back to home
                    </a>
                </div>

                {content}
            </div>
        </main>
    );
}
