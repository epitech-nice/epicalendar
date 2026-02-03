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
import { DaysService, Day, DayUpdate } from "@/services/days.service";
import { useAuth } from "@/contexts/auth.context";
import Link from "next/link";
import Loading from "@/components/loading.components";
import DatePicker from "react-datepicker";
import { Account, AccountsService } from "@/services/accounts.service";

export default function ManageDaysEditId() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { user, loading, isAuthenticated } = useAuth();

    const [aers, setAers] = useState<Account[]>([]);
    const [day, setDay] = useState<Day | null>(null);
    const [preset, setPreset] = useState<string>("Custom");
    const [formData, setFormData] = useState<DayUpdate | null>(null);
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

    const fetchDay = useCallback(async () => {
        try {
            const dayData = await DaysService.getDayById(id);
            dayData.date = new Date(dayData.date);
            dayData.open = new Date(dayData.open);
            dayData.start = new Date(dayData.start);
            dayData.close = new Date(dayData.close);
            if (dayData.end) {
                dayData.end = new Date(dayData.end);
            }
            setDay(dayData);
            if (formData === null) {
                setFormData({
                    date: new Date(dayData.date),
                    open: new Date(dayData.open),
                    start: new Date(dayData.start),
                    close: new Date(dayData.close),
                    end: dayData.end ? new Date(dayData.end) : undefined,
                    aers: dayData.aers || [],
                    message: dayData.message || "",
                    observations: dayData.observations || "",
                });
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while fetching the day.",
            );
        }
    }, [formData, id]);

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

            if (formData?.aers && formData.aers.includes(aer._id!)) {
                setError("This AER is already added.");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                aers: [...(prev?.aers || []), aer._id!],
            }));

            (e.target as HTMLInputElement).value = "";
        }
    };

    const handleDeleteAer = (id: string) => {
        setFormData((prev) => ({
            ...prev,
            aers: prev?.aers ? prev.aers.filter((aerId) => aerId !== id) : [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError("");

        if (!formData) {
            setError("No form data to submit.");
            setResponseLoading(false);
            return;
        }

        const finalFormData: DayUpdate = {};
        for (const key in formData) {
            const k = key as keyof DayUpdate;
            // avoid using `any` to satisfy ESLint rule
            const originalValue = day
                ? (day as Day)[k as keyof Day]
                : undefined;
            const newValue = formData[k];

            const isDate =
                newValue instanceof Date && originalValue instanceof Date;
            const areDatesEqual =
                isDate &&
                newValue.getTime() === (originalValue as Date).getTime();
            if (
                newValue !== undefined &&
                newValue !== null &&
                newValue !== "" &&
                (!isDate ? newValue !== originalValue : !areDatesEqual)
            ) {
                // Use a controlled any cast here to satisfy TypeScript's indexed-access typing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (finalFormData as any)[k] = newValue;
            }
        }

        try {
            //console.log(finalFormData);
            await DaysService.updateDay(id, finalFormData);
            router.push("/manage-days");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while updating the day.",
            );
        } finally {
            setResponseLoading(false);
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

        fetchAers();
        fetchDay();
    }, [fetchAers, fetchDay, id, isAuthenticated, loading, router, user]);

    let content = null;

    if (loading) {
        content = <Loading />;
    } else {
        content = day ? (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="date">Date</label>
                    <DatePicker
                        selected={formData?.date}
                        onChange={(date) => handleDateChange("date", date)}
                        dateFormat="dd-MM-yyyy"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="preset">Preset</label>
                    <select
                        id="preset"
                        name="preset"
                        value={preset}
                        onChange={handlePreset}
                    >
                        <option value="Custom">Custom</option>
                        <option value="Normal">Normal (8h–18h–22h)</option>
                        <option value="Pool">Pool (8h–18h–23h42)</option>
                        <option value="Summer">Summer (8h–18h–20h)</option>
                        <option value="Week-end">Week-end (10h–10h–20h)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="open">Campus opens at</label>
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
                    <label htmlFor="start">Guard start at</label>
                    <DatePicker
                        selected={formData?.start}
                        onChange={(date) => handleDateChange("start", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Sstart"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="close">Campus closes at</label>
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
                    <label htmlFor="end">Guard ends at</label>
                    <DatePicker
                        selected={formData?.end}
                        onChange={(date) => handleDateChange("end", date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="End"
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                    />
                </div>

                <div>
                    <label>AER list</label>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Total guard time</th>
                                <th>Preferred day</th>
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

                                    <td>{aer.day || ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <label htmlFor="aerInput">Add AER by email</label>
                    <input
                        type="text"
                        id="aerInput"
                        list="aerOptions"
                        onKeyDown={handleAerChange}
                        placeholder="Enter AER email and press Enter"
                    />
                    <datalist id="aerOptions">
                        {aers.map((aer) => (
                            <option key={aer._id} value={aer.email} />
                        ))}
                    </datalist>
                </div>

                <div>
                    {formData?.aers &&
                        formData.aers.map((id) => {
                            const aer = aers.find((a) => a._id === id);
                            if (!aer) return null;
                            return (
                                <div key={id}>
                                    <span>
                                        {aer.first_name} {aer.last_name}
                                    </span>
                                    <button onClick={() => handleDeleteAer(id)}>
                                        ❌
                                    </button>
                                </div>
                            );
                        })}
                </div>

                <div>
                    <label htmlFor="message">Optional message</label>
                    <input
                        type="text"
                        id="message"
                        name="message"
                        value={formData?.message}
                        onChange={handleChange}
                        placeholder="A informative message for the day"
                    />
                </div>

                <div>
                    <label htmlFor="observations">Observations</label>
                    <input
                        type="text"
                        id="observations"
                        name="observations"
                        value={formData?.observations}
                        onChange={handleChange}
                        placeholder="Any observations for the day"
                    />
                </div>

                {error && <div>{error}</div>}

                <button type="submit" disabled={responseLoading}>
                    {responseLoading ? "Updating..." : "Update day"}
                </button>
            </form>
        ) : null;
    }

    return (
        <main>
            <h1>Manage days - Edit</h1>

            {content}

            <Link href="/manage-days">← Back to days</Link>
        </main>
    );
}
