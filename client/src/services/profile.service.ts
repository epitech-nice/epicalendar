/**
 * @file profile.service.ts
 * @brief 
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

import api from "./api.service";
import axios from "axios";
import { Account, AccountUpdate } from "@/services/accounts.service";

export const ProfileService = {
    async getProfile(): Promise<Account> {
        try {
            return (await api.get("/me")).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Profile retrieval error";
                throw new Error(message);
            } else {
                throw new Error("Profile retrieval error");
            }
        }
    },

    async updateProfile(dataToUpdate: AccountUpdate): Promise<Account> {
        try {
            return (await api.put("/me", dataToUpdate)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Profile update error";
                throw new Error(message);
            } else {
                throw new Error("Profile update error");
            }
        }
    },
};
