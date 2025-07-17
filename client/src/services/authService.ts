import api from "api";



export const authService = {
  async login(data: { email: string; password: string }) {
    try {
      const response = await api.post('/login', data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response.data;
    } catch (error) {
      const message = error.response.data.message || "Erreur de connexion";
      throw new Error(message);
    }
  },


  async register(data: { email: string, first_name: string, last_name: string, password: string }) {
    try {
      const response = await api.post('/register', data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response.data;
    } catch (error) {
      const message = error.response.data.message || "Erreur d'inscription";
      throw new Error(message);
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


  isAuthenticated(): boolean {
    return !!this.getToken();
  },


  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },


  getProfile() {
    try {
      const response = api.get('/me');
      return response.data;
    } catch (error) {
      const message = error.response.data.message || "Erreur lors de la récupération du profil";
      throw new Error(message);
    }
  }
};
