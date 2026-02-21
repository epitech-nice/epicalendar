/**
 * @file page.tsx
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth.context";
import { Day, DaysService } from "@/services/days.service";
import Loading from "@/components/ui/loading.component";
import DatePicker from "react-datepicker";
import { Account, AccountsService } from "@/services/accounts.service";

export default function ManageDaysAdd() {
    const router = useRouter();

    const { user, loading, isAuthenticated } = useAuth();

    const [aers, setAers] = useState<Account[]>([]);
    const [formData, setFormData] = useState<Day>({
        date: new Date(),
        open: new Date(),
        start: new Date(),
        close: new Date(),
        aers: [],
        message: "",
    });
    const [preset, setPreset] = useState<string>("Custom");
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAers = useCallback(async () => {
        try {
            const aersData = await AccountsService.getAers();
            setAers(aersData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the aers.",
            );
        }
    }, []);

    function getHours(hours: number, minutes: number): Date {
        const newDate = new Date(Date.now());
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    }

    const handlePreset = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const selected = e.target.value;
        setPreset(selected);

        if (selected === "Normal") {
            setFormData((prev) => ({
                ...prev,
                open: getHours(8, 0),
                start: getHours(18, 0),
                close: getHours(22, 0),
            }));
        } else if (selected === "Pool") {
            setFormData((prev) => ({
                ...prev,
                open: getHours(8, 0),
                start: getHours(18, 0),
                close: getHours(23, 42),
            }));
        } else if (selected === "Summer") {
            setFormData((prev) => ({
                ...prev,
                open: getHours(8, 0),
                start: getHours(18, 0),
                close: getHours(20, 0),
            }));
        } else if (selected === "Week-end") {
            setFormData((prev) => ({
                ...prev,
                open: getHours(10, 0),
                start: getHours(10, 0),
                close: getHours(20, 0),
            }));
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (name: keyof Day, value: Date | null) => {
        if (!value) return;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAerChange = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const input = (e.target as HTMLInputElement).value.trim();
            const aer = aers.find((a) => a.email === input);

            if (!aer) {
                setError("No AER found with that email.");
                return;
            }

            if (formData.aers && formData.aers.includes(aer._id!)) {
                setError("This AER is already added.");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                aers: [...(prev.aers || []), aer._id!],
            }));

            (e.target as HTMLInputElement).value = "";
        }
    };

    const handleDeleteAer = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            aers: prev.aers ? prev.aers.filter((aerId) => aerId !== id) : [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError("");

        try {
            await DaysService.addDay(formData);
            router.push("/manage-days");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while adding the day.",
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

        if (!user || user.role === "student") {
            setError("You do not have permission to access this page.");
            return;
        }

        fetchAers();
    }, [isAuthenticated, loading, user, router, fetchAers]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else {
        content = (
            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "1.5rem" }}>
                    <h2
                        className="section-title"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        Date & Schedule
                    </h2>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <DatePicker
                                selected={formData.date}
                                onChange={(date) =>
                                    handleDateChange("date", date)
                                }
                                dateFormat="dd-MM-yyyy"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Preset</label>
                            <select
                                id="preset"
                                name="preset"
                                className="form-select"
                                value={preset}
                                onChange={handlePreset}
                            >
                                <option value="Custom">Custom</option>
                                <option value="Normal">
                                    Normal (8h–18h–22h)
                                </option>
                                <option value="Pool">
                                    Pool (8h–18h–23h42)
                                </option>
                                <option value="Summer">
                                    Summer (8h–18h–20h)
                                </option>
                                <option value="Week-end">
                                    Week-end (10h–10h–20h)
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row-2" style={{ marginTop: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">
                                Campus opens at
                            </label>
                            <DatePicker
                                selected={formData.open}
                                onChange={(date) =>
                                    handleDateChange("open", date)
                                }
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
                            <label className="form-label">
                                Guard starts at
                            </label>
                            <DatePicker
                                selected={formData.start}
                                onChange={(date) =>
                                    handleDateChange("start", date)
                                }
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Start"
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row-2" style={{ marginTop: "1rem" }}>
                        <div className="form-group">
                            <label className="form-label">
                                Campus closes at
                            </label>
                            <DatePicker
                                selected={formData.close}
                                onChange={(date) =>
                                    handleDateChange("close", date)
                                }
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Close"
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Optional Message
                            </label>
                            <input
                                type="text"
                                id="message"
                                name="message"
                                className="form-input"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="An informative message for the day"
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="card"
                    style={{
                        marginBottom: "1.5rem",
                        padding: 0,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "1.25rem 1.5rem",
                            borderBottom: "1px solid rgb(var(--color-border))",
                        }}
                    >
                        <h2 className="section-title" style={{ margin: 0 }}>
                            AER Reference List
                        </h2>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Total Guard Time</th>
                                    <th>Preferred Day</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aers.map((aer) => (
                                    <tr key={aer._id}>
                                        <td>{aer.email}</td>
                                        <td>
                                            {aer.first_name} {aer.last_name}
                                        </td>
                                        <td>
                                            {aer.guard_time
                                                ? `${aer.guard_time.total}`
                                                : "N/A"}
                                        </td>
                                        <td>{aer.day || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "1.5rem" }}>
                    <h2
                        className="section-title"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        Assign AERs
                    </h2>

                    <div className="form-group">
                        <label htmlFor="aerInput" className="form-label">
                            Add AER by email (press Enter)
                        </label>
                        <input
                            type="text"
                            id="aerInput"
                            list="aerOptions"
                            className="form-input"
                            onKeyDown={handleAerChange}
                            placeholder="Enter AER email and press Enter"
                        />
                        <datalist id="aerOptions">
                            {aers.map((aer) => (
                                <option key={aer._id} value={aer.email} />
                            ))}
                        </datalist>
                    </div>

                    {formData.aers && formData.aers.length > 0 && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                                marginTop: "0.75rem",
                            }}
                        >
                            {formData.aers.map((id) => {
                                const aer = aers.find((a) => a._id === id);
                                if (!aer) return null;
                                return (
                                    <div key={id} className="aer-tag">
                                        <span>
                                            {aer.first_name} {aer.last_name}
                                        </span>
                                        <button
                                            type="button"
                                            className="aer-tag-remove"
                                            onClick={() => handleDeleteAer(id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={responseLoading}
                    >
                        {responseLoading ? "Adding..." : "Add Day"}
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
                        <Link href="/manage-days" className="back-link">
                            ← Back to days
                        </Link>
                        <h1 className="page-title">Add Day</h1>
                    </div>
                </div>

                {content}
            </div>
        </div>
    );
}
