/**
 * @file page.tsx
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import {
    OpeningRequest,
    OpeningRequestsService,
} from "@/services/opening-requests.service";
import Loading from "@/components/ui/loading.component";
import DatePicker from "react-datepicker";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";

export default function ManageOpeningRequestsAdd() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const defaultOpen = new Date(Date.now());
    defaultOpen.setHours(10, 0, 0, 0);
    const defaultClose = new Date(Date.now());
    defaultClose.setHours(20, 0, 0, 0);
    const [formData, setFormData] = useState<OpeningRequest>({
        date: new Date(Date.now()),
        open: defaultOpen,
        close: defaultClose,
        message: "",
    });
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (
        name: keyof OpeningRequest,
        value: Date | null,
    ) => {
        if (!value) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError("");

        try {
            await OpeningRequestsService.addOpeningRequest(formData);
            router.push("/opening-requests");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while adding the opening request.",
            );
        } finally {
            setResponseLoading(false);
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
    }, [isAuthenticated, loading, user, router]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else {
        content = (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="date">Date</label>
                    <DatePicker
                        selected={formData.date}
                        onChange={(date) => handleDateChange("date", date)}
                        dateFormat="dd-MM-yyyy"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="open">Campus opens at</label>
                    <DatePicker
                        selected={formData.open}
                        onChange={(date) => handleDateChange("open", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Open"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                    <label htmlFor="close">Campus closes at</label>
                    <DatePicker
                        selected={formData.close}
                        onChange={(date) => handleDateChange("close", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Close"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message">Message</label>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Why do you want to open the campus?"
                        required
                    />
                </div>

                {error && <div>{error}</div>}

                <button type="submit" disabled={responseLoading}>
                    {responseLoading ? "Adding..." : "Add opening request"}
                </button>
            </form>
        );
    }

    return (
        <main>
            <h1 className="page-title">Opening requests - Add</h1>

            <div>
                WARNING: only EPITECH student can formulate an opening request.
                An opening request must be send 24h before the day to open the
                campus.
            </div>

            {content}

            <Link href="/opening-requests">← Back to opening requests</Link>
        </main>
    );
}
