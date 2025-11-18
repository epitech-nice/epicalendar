import api from "./api";
import axios from "axios";

export interface OpeningRequest {
    _id?: string;
    date: Date;
    open: Date;
    close: Date;
    created_at?: Date;
    account?: string;
    status?: "waiting" | "accepted" | "rejected";
    message: string;
    response?: string;
}

export interface OpeningRequestUpdate {
    date?: Date;
    open?: Date;
    close?: Date;
    status?: "waiting" | "accepted" | "rejected";
    message?: string;
    response?: string;
}

export const OpeningRequestsService = {
    async getOpeningRequests(): Promise<OpeningRequest[]> {
        try {
            return (await api.get("/opening-requests")).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "Error fetching opening requests";
                throw new Error(message);
            } else {
                throw new Error("Error fetching opening requests");
            }
        }
    },

    async getOpeningRequestById(id: string): Promise<OpeningRequest> {
        try {
            return (await api.get(`/opening-requests/${id}`)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "Error fetching opening request";
                throw new Error(message);
            } else {
                throw new Error("Error fetching opening request");
            }
        }
    },

    async addOpeningRequest(openingRequest: OpeningRequest) {
        try {
            return (await api.post("/opening-requests", openingRequest)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "Error adding opening request";
                throw new Error(message);
            } else {
                throw new Error("Error adding opening request");
            }
        }
    },

    async updateOpeningRequest(
        id: string,
        dataToUpdate: OpeningRequestUpdate,
    ): Promise<OpeningRequest> {
        try {
            return (await api.put(`/opening-requests/${id}`, dataToUpdate))
                .data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "Error updating opening request";
                throw new Error(message);
            } else {
                throw new Error("Error updating opening request");
            }
        }
    },

    async deleteOpeningRequest(id: string): Promise<void> {
        try {
            await api.delete(`/opening-requests/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "Error deleting opening request";
                throw new Error(message);
            } else {
                throw new Error("Error deleting opening request");
            }
        }
    },
};
