"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, User } from '@/services/authService';



interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (data: { email: string; password: string }) => Promise<void>;
    register: (data: { email: string; first_name: string; last_name: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};



export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = AuthService.getToken();
            if (storedToken) {
                try {
                    await AuthService.updateUser();
                    setUser(AuthService.getUser());
                } catch (error) {
                    console.error('\x1b[31mError validating token:\x1b[0m', error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (data: { email: string; password: string }) => {
        const response = await AuthService.login(data);
        setUser(response.user);
    };

    const register = async (data: { email: string; first_name: string; last_name: string; password: string }) => {
        const response = await AuthService.register(data);
        setUser(response.user);
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
