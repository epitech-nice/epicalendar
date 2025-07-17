import api from "./api";
import axios from "axios";



export interface User {
  email: string;
  first_name: string;
  last_name: string;
  role: 'étudiant' | 'aer' | 'admin';
  photo: string;
}



export const AuthService = {
  async login(data: { email: string; password: string }) {
    try {
      const response = await api.post('/login', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Erreur de connexion";
        throw new Error(message);
      } else {
        throw new Error("Erreur de connexion");
      }
    }
  },


  async register(data: { email: string, first_name: string, last_name: string, password: string }) {
    try {
      const response = await api.post('/register', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Erreur d'inscription";
        throw new Error(message);
      } else {
        throw new Error("Erreur d'inscription");
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
      const user = (await api.get('user')).data;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Erreur lors de la mise à jour de l'utilisateur";
        throw new Error(message);
      } else {
        throw new Error("Erreur lors de la mise à jour de l'utilisateur");
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


  async getProfile() {
    try {
      return (await api.get('/me')).data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Erreur lors de la récupération du profil";
        throw new Error(message);
      } else {
        throw new Error("Erreur lors de la récupération du profil");
      }
    }
  }
};
