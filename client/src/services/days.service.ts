/**
 * @file days.service.ts
 * @brief
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

import api from "./api.service";
import axios from "axios";
import { Account } from "./accounts.service";

export interface Day {
    _id?: string;
    date: Date;
    open: Date;
    start: Date;
    close: Date;
    end?: Date;
    aers?: (string | Account)[];
    message?: string;
    observations?: string;
}

export interface DayUpdate {
    date?: Date;
    open?: Date;
    start?: Date;
    close?: Date;
    end?: Date;
    aers?: string[];
    message?: string;
    observations?: string;
}

export interface DaysPaginatedResponse {
    days: Day[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const DaysService = {
    async getDays(page: number = 1, limit: number = 20): Promise<DaysPaginatedResponse> {
        try {
            return (await api.get("/days", { params: { page, limit } })).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error fetching days";
                throw new Error(message);
            } else {
                throw new Error("Error fetching days");
            }
        }
    },

    async getDayById(id: string): Promise<Day> {
        try {
            return (await api.get(`/days/${id}`)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error fetching day";
                throw new Error(message);
            } else {
                throw new Error("Error fetching day");
            }
        }
    },

    async getCurrentDay(): Promise<Day> {
        try {
            return (await api.get("/days/current")).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message ||
                    "Error fetching current day";
                throw new Error(message);
            } else {
                throw new Error("Error fetching current day");
            }
        }
    },

    async addDay(day: Day) {
        try {
            return (await api.post("/days", day)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error adding day";
                throw new Error(message);
            } else {
                throw new Error("Error adding day");
            }
        }
    },

    async updateDay(id: string, dataToUpdate: DayUpdate): Promise<Day> {
        try {
            return (await api.put(`/days/${id}`, dataToUpdate)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error updating day";
                throw new Error(message);
            } else {
                throw new Error("Error updating day");
            }
        }
    },

    async deleteDay(id: string): Promise<void> {
        try {
            await api.delete(`/days/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message =
                    error.response?.data?.message || "Error deleting day";
                throw new Error(message);
            } else {
                throw new Error("Error deleting day");
            }
        }
    },
};
