import api from "./api";
import axios from "axios";



export interface Account {
    _id?: string;
    email: string;
    password: string;
    created_at?: Date;
    first_name: string;
    last_name: string;
    role: 'student' | 'aer' | 'admin';
    description?: string;
    photo?: string;
    day?: string;
    room?: string;
}

export const AccountService = {
    async getAccounts() : Promise<Account[]> {
        try {
            const response = await api.get('/accounts');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error fetching accounts";
                throw new Error(message);
            } else {
                throw new Error("Error fetching accounts");
            }
        }
    },


    async getAccountById(id: string) : Promise<Account> {
        try {
            const response = await api.get(`/accounts/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error fetching account";
                throw new Error(message);
            } else {
                throw new Error("Error fetching account");
            }
        }
    },


    async addAccount(account: Omit<Account, 'id' | 'created_at'>) {
        try {
            const response = await api.post('/accounts', account);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error adding account";
                throw new Error(message);
            } else {
                throw new Error("Error adding account");
            }
        }
    },


    async updateAccount(id: string, dataToUpdate: never) : Promise<Account> {
        try {
            const response = await api.put(`/accounts/${id}`, dataToUpdate);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error updating account";
                throw new Error(message);
            } else {
                throw new Error("Error updating account");
            }
        }
    },


    async deleteAccount(id: string) : Promise<void> {
        try {
            await api.delete(`/accounts/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error deleting account";
                throw new Error(message);
            } else {
                throw new Error("Error deleting account");
            }
        }
    }
}