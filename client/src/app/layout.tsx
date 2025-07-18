import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles.css";
import {AuthProvider} from "@/contexts/authContext";
import Header from "@/components/header";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "EpiCalendar",
  description: "The IONIS Nice campus opening schedule",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
