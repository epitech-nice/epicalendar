/**
 * @file theme.context.tsx
 * @brief Theme context for managing light/dark mode in EpiCalendar
 * @project EpiCalendar - Epitech Project
 * @author Nicolas TORO <nicolas.toro@epitech.eu>
 * @copyright (c) 2025-2026 EPITECH Nice
 */

"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "epicalendar_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>("system");
    const [isLoaded, setIsLoaded] = useState(false);

    // Calculate if dark mode is active
    const isDark =
        theme === "system"
            ? typeof window !== "undefined" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches
            : theme === "dark";

    // Load saved theme preference on mount
    useEffect(() => {
        loadTheme();
    }, []);

    // Update document class when isDark changes
    useEffect(() => {
        if (isLoaded && typeof document !== "undefined") {
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, [isDark, isLoaded]);

    const loadTheme = () => {
        try {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            if (
                savedTheme &&
                ["light", "dark", "system"].includes(savedTheme)
            ) {
                setThemeState(savedTheme as ThemeMode);
            }
        } catch (error) {
            console.error("Failed to load theme:", error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setTheme = (newTheme: ThemeMode) => {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error("Failed to save theme:", error);
        }
    };

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        setTheme(newTheme);
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
