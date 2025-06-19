import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/contexts/themeContext";
import { LocaleProvider } from "@/contexts/localeContext";
import { LayoutProvider } from "@/contexts/layoutContext";
import { AuthProvider } from "@/contexts/authContext";
import { EntityProvider } from "@/contexts/entityContext";
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from "@/contexts/toastContext";
import { CommonModalProvider } from "@/contexts/commonModalContext";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CheckBiz360 Platform SaaS",
    description: "CheckBiz360 Platform SaaS",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {




    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <LocaleProvider>
                    <AuthProvider>
                        <EntityProvider>
                            <LayoutProvider>
                                <ThemeProvider>
                                    <ToastProvider>
                                        <CommonModalProvider>
                                            <NextTopLoader showSpinner={false} color="#1976d2" />
                                            {children}
                                        </CommonModalProvider>
                                    </ToastProvider>
                                </ThemeProvider>
                            </LayoutProvider>
                        </EntityProvider>
                    </AuthProvider>
                </LocaleProvider>
            </body>
        </html>
    );
}
