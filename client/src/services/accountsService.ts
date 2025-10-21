import api from "./api";
import axios from "axios";

export interface GuardTime {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
    total: number;
}

export interface Account {
    _id?: string;
    email: string;
    password: string;
    created_at?: Date;
    first_name: string;
    last_name: string;
    role: "student" | "aer" | "admin";
    description?: string;
    photo?: string;
    guard_time?: GuardTime;
    day?:
        | ""
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday";
    room?: string;
}

export interface AccountUpdate {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    role?: "student" | "aer" | "admin";
    description?: string;
    photo?: string;
    day?:
        | ""
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday";
    room?: string;
}

export const AccountsService = {
    async getAccounts(): Promise<Account[]> {
        try {
            return (await api.get("/accounts")).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error fetching accounts";
                throw new Error(message);
            } else {
                throw new Error("Error fetching accounts");
            }
        }
    },

    async getAccountById(id: string): Promise<Account> {
        try {
            return (await api.get(`/accounts/${id}`)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error fetching account";
                throw new Error(message);
            } else {
                throw new Error("Error fetching account");
            }
        }
    },

    async getAers(): Promise<Account[]> {
        try {
            return (await api.get("/accounts/aer")).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error fetching AERs";
                throw new Error(message);
            } else {
                throw new Error("Error fetching AERs");
            }
        }
    },

    async getAerById(id: string): Promise<Account> {
        try {
            const aers = this.getAers();
            const aer = (await aers).find((aer) => aer._id === id);
            if (!aer) {
                throw new Error("AER not found");
            }
            return aer;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error fetching AER";
                throw new Error(message);
            } else {
                throw new Error("Error fetching AER");
            }
        }
    },

    async addAccount(account: Account) {
        try {
            return (await api.post("/accounts", account)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error adding account";
                throw new Error(message);
            } else {
                throw new Error("Error adding account");
            }
        }
    },

    async updateAccount(
        id: string,
        dataToUpdate: AccountUpdate
    ): Promise<Account> {
        try {
            return (await api.put(`/accounts/${id}`, dataToUpdate)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error updating account";
                throw new Error(message);
            } else {
                throw new Error("Error updating account");
            }
        }
    },

    async deleteAccount(id: string): Promise<void> {
        try {
            await api.delete(`/accounts/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error deleting account";
                throw new Error(message);
            } else {
                throw new Error("Error deleting account");
            }
        }
    },
};
