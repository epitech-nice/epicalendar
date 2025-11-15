import api from "./api";
import axios from "axios";
import { Account, AccountUpdate } from "@/services/accountsService";

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
