/**
 * @file page.tsx
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import {
    OpeningRequest,
    OpeningRequestsService,
    OpeningRequestUpdate,
} from "@/services/opening-requests.service";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import Loading from "@/components/ui/loading.component";
import DatePicker from "react-datepicker";
import Loading from "@/components/loading";
import { useAuth } from "@/contexts/authContext";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ManageOpeningRequestsEditId() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { user, loading, isAuthenticated } = useAuth();

    const [openingRequest, setOpeningRequest] = useState<OpeningRequest | null>(
        null,
    );
    const [formData, setFormData] = useState<OpeningRequestUpdate | null>(null);
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchOpeningRequest = useCallback(async () => {
        try {
            const openingRequestData =
                await OpeningRequestsService.getOpeningRequestById(id);
            openingRequestData.date = new Date(openingRequestData.date);
            openingRequestData.open = new Date(openingRequestData.open);
            openingRequestData.close = new Date(openingRequestData.close);
            setOpeningRequest(openingRequestData);
            if (formData === null) {
                setFormData({
                    date: new Date(openingRequestData.date),
                    open: new Date(openingRequestData.open),
                    close: new Date(openingRequestData.close),
                    message: openingRequestData.message,
                    status: openingRequestData.status,
                    response: openingRequestData.response || "",
                });
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the opening request.",
            );
        }
    }, [formData, id]);

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

        const finalFormData: OpeningRequestUpdate = {};
        for (const key in formData) {
            const originalValue = openingRequest
                ? openingRequest[key as keyof OpeningRequest]
                : undefined;
            const newValue = formData[key as keyof OpeningRequestUpdate];

            const isDate =
                newValue instanceof Date && originalValue instanceof Date;
            const areDatesEqual =
                isDate && newValue.getTime() === originalValue.getTime();
            if (
                newValue !== undefined &&
                newValue !== null &&
                newValue !== "" &&
                (!isDate ? newValue !== originalValue : !areDatesEqual)
            ) {
                // Use a controlled any cast here to satisfy TypeScript's indexed-access typing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (finalFormData as any)[key as keyof OpeningRequestUpdate] =
                    newValue;
            }
        }

        try {
            //console.log(finalFormData);
            await OpeningRequestsService.updateOpeningRequest(
                id,
                finalFormData,
            );
            router.push("/opening-requests");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while updating the opening request.",
            );
        } finally {
            setResponseLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError("Opening request ID is required.");
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

        fetchOpeningRequest();
    }, [fetchOpeningRequest, id, isAuthenticated, loading, router, user]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else {
        content = openingRequest ? (
            <form onSubmit={handleSubmit} className="card">
                <div
                    style={{
                        marginBottom: "1.25rem",
                        padding: "0.75rem",
                        background: "rgb(var(--color-background-secondary))",
                        borderLeft: "3px solid rgb(var(--color-primary))",
                    }}
                >
                    <div className="info-row">
                        <span className="info-label">ID</span>
                        <span
                            className="info-value"
                            style={{
                                fontFamily: "monospace",
                                fontSize: "0.85rem",
                            }}
                        >
                            {openingRequest._id}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Created at</span>
                        <span className="info-value">
                            {openingRequest.created_at
                                ? new Date(
                                      openingRequest.created_at,
                                  ).toLocaleDateString("fr-FR", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  })
                                : "Unknown date"}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Submitted by</span>
                        <span className="info-value">
                            {openingRequest.account}
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Date</label>
                    <DatePicker
                        selected={formData?.date}
                        onChange={(date) => handleDateChange("date", date)}
                        dateFormat="dd-MM-yyyy"
                        required
                    />
                </div>

                <div className="form-row-2">
                    <div className="form-group">
                        <label className="form-label">Campus opens at</label>
                        <DatePicker
                            selected={formData?.open}
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
                            selected={formData?.close}
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
                        Message
                    </label>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        className="form-input"
                        value={formData?.message}
                        onChange={handleChange}
                        placeholder="Why do you want to open the campus?"
                    />
                </div>

                <div className="form-row-2">
                    <div className="form-group">
                        <label htmlFor="status" className="form-label">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="form-select"
                            value={formData?.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="waiting">Waiting</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="response" className="form-label">
                            Response
                        </label>
                        <input
                            type="text"
                            id="response"
                            name="response"
                            className="form-input"
                            value={formData?.response}
                            onChange={handleChange}
                            placeholder="Response to the opening request"
                        />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={responseLoading}
                    >
                        {responseLoading ? "Updating..." : "Update Request"}
                    </button>
                </div>
            </form>
        ) : null;
    }

    return (
        <div className="page-wrapper">
            <div className="page-container">
                <div className="page-header">
                    <div className="page-header-left">
                        <Link href="/opening-requests" className="back-link">
                            ← Back to opening requests
                        </Link>
                        <h1 className="page-title">Edit Opening Request</h1>
                    </div>
                </div>

                {content}
            </div>
        </div>
    );
}
