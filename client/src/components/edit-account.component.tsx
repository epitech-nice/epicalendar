/**
 * @file edit-account.component.tsx
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    AccountsService,
    Account,
    AccountUpdate,
} from "@/services/accounts.service";
import { useAuth } from "@/contexts/auth.context";
import ImageUpload from "@/components/image-upload.component";
import { ProfileService } from "@/services/profile.service";

export default function EditAccount({
    account,
    id,
    profile,
}: {
    account: Account;
    id?: string;
    profile?: boolean;
}) {
    const router = useRouter();

    const { user, loading } = useAuth();

    const [formData, setFormData] = useState<AccountUpdate | null>({
        email: account.email,
        first_name: account.first_name,
        last_name: account.last_name,
        password: "",
        role: account.role,
        description: account.description || "",
        photo: account.photo || "/default-user.jpg",
        day: account.day || "",
        room: account.room || "",
    });
    const [responseLoading, setResponseLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUploaded = (imageUrl: string) => {
        setFormData({
            ...formData,
            photo: imageUrl,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResponseLoading(true);
        setError("");

        const finalFormData: AccountUpdate = {};
        for (const key in formData) {
            const originalValue = account
                ? account[key as keyof Account]
                : undefined;
            const newValue = formData[key as keyof AccountUpdate];
            if (
                newValue !== undefined &&
                newValue !== null &&
                newValue !== "" &&
                newValue !== originalValue
            ) {
                // Use a controlled any cast here to satisfy TypeScript's indexed-access typing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (finalFormData as any)[key as keyof AccountUpdate] = newValue;
            }
        }
        //console.log(formData);

        try {
            if (profile) {
                await ProfileService.updateProfile(finalFormData);
                router.push("/profile");
            } else if (id) {
                await AccountsService.updateAccount(id, finalFormData);
                router.push("/manage-accounts");
            }
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while updating the account.",
            );
        } finally {
            setResponseLoading(false);
        }
    };

    if (loading) {
        return;
    }

    return (
        <form onSubmit={handleSubmit} className="card">
            <div className="form-row-2">
                <div className="form-group">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        className="form-input"
                        value={formData?.first_name}
                        onChange={handleChange}
                        required
                        placeholder="Your first name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        className="form-input"
                        value={formData?.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Your last name"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData?.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                />
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-input"
                    value={formData?.password}
                    onChange={handleChange}
                    placeholder="Leave empty to keep current password"
                />
            </div>

            {user?.role === "admin" && (
                <div className="form-group">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={formData?.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="student">Student</option>
                        <option value="aer">AER</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            )}

            <div className="form-group">
                {account?.photo && (
                    <ImageUpload
                        onImageUploaded={handleImageUploaded}
                        currentImage={account?.photo}
                    />
                )}
            </div>

            <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    className="form-input"
                    value={formData?.description}
                    onChange={handleChange}
                    placeholder="A short description of you"
                />
            </div>

            <div className="form-row-2">
                <div className="form-group">
                    <label htmlFor="day" className="form-label">Preferred Day</label>
                    <select
                        id="day"
                        name="day"
                        className="form-select"
                        value={formData?.day}
                        onChange={handleChange}
                    >
                        <option value="">— None —</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="room" className="form-label">Preferred Room</label>
                    <input
                        type="text"
                        id="room"
                        name="room"
                        className="form-input"
                        value={formData?.room}
                        onChange={handleChange}
                        placeholder="Room name"
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={responseLoading}>
                    {responseLoading ? "Updating..." : "Update Account"}
                </button>
            </div>
        </form>
    );
}
