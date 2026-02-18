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
import { DaysService, Day } from "@/services/days.service";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import Loading from "@/components/ui/loading.component";
import { AccountsService } from "@/services/accounts.service";

export default function ManageDaysDisplayId() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { user, loading, isAuthenticated } = useAuth();

    const [day, setDay] = useState<Day | null>(null);
    const [error, setError] = useState("");

    const fetchDay = useCallback(async () => {
        try {
            const dayData = await DaysService.getDayById(id);
            const aers: string[] = [];
            for (const aerId of dayData.aers || []) {
                try {
                    const account = await AccountsService.getAerById(aerId);
                    if (account) {
                        aers.push(`${account.first_name} ${account.last_name}`);
                    } else {
                        console.warn(`AER with ID ${aerId} not found.`);
                    }
                } catch (err) {
                    console.error(`Error fetching AER with ID ${aerId}:`, err);
                }
            }
            dayData.aers = aers;
            setDay(dayData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the day.",
            );
        }
    }, [id]);

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
            router.push("/manage-days");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while deleting the day.",
            );
        }
    };

    useEffect(() => {
        if (!id) {
            setError("Day ID is required.");
            return;
        }

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

        fetchDay();
    }, [fetchDay, id, isAuthenticated, loading, router, user]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <div className="error-message">{error}</div>;
    } else {
        content = day ? (
            <div>
                <div className="card" style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <h2 className="section-title" style={{ margin: 0 }}>
                            {new Date(day.date).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </h2>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => router.push(`/manage-days/edit/${day?._id}`)}
                            >
                                Edit
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteDay(day._id!)}>
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="form-row-2">
                        <div>
                            <div className="info-row">
                                <span className="info-label">Campus opens at</span>
                                <span className="info-value">
                                    {day.open ? new Date(day.open).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Not set"}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Guard starts at</span>
                                <span className="info-value">
                                    {day.start ? new Date(day.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Not set"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="info-row">
                                <span className="info-label">Campus closes at</span>
                                <span className="info-value">
                                    {day.close ? new Date(day.close).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Not set"}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Guard ends at</span>
                                <span className="info-value">
                                    {day.end ? new Date(day.end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Not set"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="info-row" style={{ marginTop: "1rem" }}>
                        <span className="info-label">AERs assigned</span>
                        <span className="info-value">
                            {day.aers && day.aers.length > 0 ? day.aers.join(", ") : "No AER assigned"}
                        </span>
                    </div>

                    {day.message && (
                        <div className="info-row">
                            <span className="info-label">Message</span>
                            <span className="info-value">{day.message}</span>
                        </div>
                    )}

                    {day.observations && (
                        <div className="info-row">
                            <span className="info-label">Observations</span>
                            <span className="info-value">{day.observations}</span>
                        </div>
                    )}
                </div>
            </div>
        ) : null;
    }

    return (
        <div className="page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <div className="page-header-left">
                        <Link href="/manage-days" className="back-link">← Back to days</Link>
                        <h1 className="page-title">Day Details</h1>
                    </div>
                </div>

                {content}
            </div>
        </div>
    );
}
