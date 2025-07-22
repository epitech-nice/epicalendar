import api from "./api";
import axios from "axios";



export interface User {
    email: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'aer' | 'admin';
    photo: string;
}



export const AuthService = {
    async login(data: { email: string; password: string }) {
        try {
            const response = (await api.post('/login', data)).data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Login error";
                throw new Error(message);
            } else {
                throw new Error("Login error");
            }
        }
    },


    async register(data: { email: string, first_name: string, last_name: string, password: string }) {
        try {
            const response = (await api.post('/register', data)).data;
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Registration error";
                throw new Error(message);
            } else {
                throw new Error("Registration error");
            }
        }
    },


    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },


    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },


    async updateUser() {
        try {
            const user = (await api.get('user')).data.user;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "User update error";
                throw new Error(message);
            } else {
                throw new Error("User update error");
            }
        }
    },


    getUser(): User | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    },
};
