import api from "./api";
import axios from "axios";



export interface Day {
    _id?: string;
    date: Date;
    start: Date;
    start_at: Date;
    end: Date;
    closed_at?: Date;
    aer?: string[];
    message?: string;
    observations?: string;
}

export interface DayUpdate {
    date?: Date;
    start?: Date;
    start_at?: Date;
    closed_at?: Date;
    end?: Date;
    aer?: string[];
    message?: string;
    observations?: string;
}



export const DaysService = {
    async getDays(): Promise<Day[]> {
        try {
            return (await api.get('/days')).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error fetching days";
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
                const message = error.response?.data?.message || "Error fetching day";
                throw new Error(message);
            } else {
                throw new Error("Error fetching day");
            }
        }
    },

    async getCurrentDay(): Promise<Day> {
        try {
            return (await api.get('/days/current')).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error fetching current day";
                throw new Error(message);
            } else {
                throw new Error("Error fetching current day");
            }
        }
    },


    async addDay(day: Day) {
        try {
            return (await api.post('/days', day)).data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Error adding day";
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
                const message = error.response?.data?.message || "Error updating day";
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
                const message = error.response?.data?.message || "Error deleting day";
                throw new Error(message);
            } else {
                throw new Error("Error deleting day");
            }
        }
    }
}
