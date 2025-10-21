"use client";

import Link from "next/link";
import Loading from "@/components/loading";
import { useAuth } from "@/contexts/authContext";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DaysService, Day } from "@/services/daysService";
import { AccountsService } from "@/services/accountsService";

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
                    : "An error occurred while fetching the day."
            );
        }
    }, [id]);

    const handleDeleteDay = async (dayId: string) => {
        console.log("Attempting to delete day with ID:", dayId);

        if (
            !confirm(
                "Are you sure you want to delete this day? This action cannot be undone."
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
                    : "An error occurred while deleting the day."
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
        content = <div className="error">{error}</div>;
    } else {
        content = day ? (
            <div>
                <div>
                    {new Date(day.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    })}
                </div>

                <div>
                    <button
                        onClick={() =>
                            router.push(`/manage-days/edit/${day?._id}`)
                        }
                    >
                        Edit
                    </button>

                    <button onClick={() => handleDeleteDay(day._id!)}>
                        Delete
                    </button>
                </div>

                <div>
                    <b>Campus opens at:</b>
                    {day.open
                        ? new Date(day.open).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "Not set"}
                    <b>Guard starts at:</b>
                    {day.start
                        ? new Date(day.start).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "Not set"}
                </div>

                <div>
                    <b>Campus closes at:</b>
                    {day.close
                        ? new Date(day.close).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "Not set"}
                    <b>Guard ends at:</b>
                    {day.end
                        ? new Date(day.end).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                          })
                        : "Not set"}
                </div>

                <div>
                    <b>AER:</b>
                    {day.aers && day.aers.length > 0
                        ? day.aers.join(", ")
                        : "No AER assigned"}
                </div>

                <div>
                    <b>Message:</b>
                    {day.message || "No message provided."}
                </div>

                <div>
                    <b>Observations:</b>
                    {day.observations || "No observations provided."}
                </div>
            </div>
        ) : null;
    }

    return (
        <main>
            <h1 className="page-title">Manage days - Display</h1>

            {content}

            <Link href="/manage-days">← Back to days</Link>
        </main>
    );
}
