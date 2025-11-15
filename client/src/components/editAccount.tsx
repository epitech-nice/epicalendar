"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AccountsService,
    Account,
    AccountUpdate,
} from "@/services/accountsService";
import { useAuth } from "@/contexts/authContext";
import ImageUpload from "@/components/imageUpload";
import { ProfileService } from "@/services/profileService";

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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                finalFormData[key as keyof AccountUpdate] =
                    newValue as AccountUpdate[typeof key];
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
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                />
            </div>

            <div>
                <label htmlFor="first_name">First Name</label>
                <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData?.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Your first name"
                />
                <label htmlFor="last_name">Last Name</label>
                <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData?.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Your last name"
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData?.password}
                    onChange={handleChange}
                    placeholder="Keep empty to not change the password"
                />
            </div>

            {user?.role === "admin" && (
                <div>
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
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

            <div>
                {account?.photo && (
                    <ImageUpload
                        onImageUploaded={handleImageUploaded}
                        currentImage={account?.photo} //formData.photo
                    />
                )}
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData?.description}
                    onChange={handleChange}
                    placeholder="A short description of you"
                />
            </div>

            <div>
                <label htmlFor="day">Preferred day</label>
                <select
                    id="day"
                    name="day"
                    value={formData?.day}
                    onChange={handleChange}
                >
                    <option value=""></option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
                <label htmlFor="room">Preferred room</label>
                <input
                    type="text"
                    id="room"
                    name="room"
                    value={formData?.room}
                    onChange={handleChange}
                    placeholder="Room name"
                />
            </div>

            {error && <div>{error}</div>}

            <button type="submit" disabled={responseLoading}>
                {responseLoading ? "Updating..." : "Update account"}
            </button>
        </form>
    );
}
