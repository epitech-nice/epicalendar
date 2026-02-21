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
            <form onSubmit={handleSubmit} className="card">
                <div className="alert-info" style={{ marginBottom: "1.5rem" }}>
                    <strong>Note:</strong> Only EPITECH students can submit an
                    opening request. Requests must be sent at least 24h in
                    advance.
                </div>

                <div className="form-group">
                    <label className="form-label">Date</label>
                    <DatePicker
                        selected={formData.date}
                        onChange={(date) => handleDateChange("date", date)}
                        dateFormat="dd-MM-yyyy"
                        required
                    />
                </div>

                <div className="form-row-2">
                    <div className="form-group">
                        <label className="form-label">Campus opens at</label>
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
                    </div>
                    <div className="form-group">
                        <label className="form-label">Campus closes at</label>
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
                </div>

                <div className="form-group">
                    <label htmlFor="message" className="form-label">
                        Reason for request
                    </label>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        className="form-input"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Why do you want to open the campus?"
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={responseLoading}
                    >
                        {responseLoading ? "Submitting..." : "Submit Request"}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <div className="page-header-left">
                        <Link href="/opening-requests" className="back-link">
                            ← Back to opening requests
                        </Link>
                        <h1 className="page-title">New Opening Request</h1>
                    </div>
                </div>

                {content}
            </div>
        </div>
    );
}
