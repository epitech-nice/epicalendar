import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/authContext";
import { ThemeProvider } from "@/contexts/themeContext";
import ClientLayout from "@/components/clientLayout";


export const metadata: Metadata = {
    title: "EpiCalendar",
    description: "The IONIS Nice campus opening schedule",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <ThemeProvider>
                    <AuthProvider>
                        <ClientLayout>{children}</ClientLayout>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
