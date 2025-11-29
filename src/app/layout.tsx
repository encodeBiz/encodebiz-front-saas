import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/themeContext";
import { LocaleProvider } from "@/contexts/localeContext";
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from "@/contexts/toastContext";
import { Suspense } from "react";   // ✅ Importar Suspense
import PageLoader from "@/components/common/PageLoader";
import { AuthProvider } from "@/contexts/authContext";
 
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "EncodeBiz Platform",
    description: "EncodeBiz Platform",
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
                    <Suspense fallback={<PageLoader  backdrop />}>  {/* ✅ Suspense envuelve AuthProvider */}
                        <ToastProvider>
                            <ThemeProvider>
                                <AuthProvider>
                                    <NextTopLoader showSpinner={false} color="#456456" />
                                   
                                    {children}
                                </AuthProvider>
                            </ThemeProvider>
                        </ToastProvider>
                    </Suspense>
                </LocaleProvider>
            </body>
        </html>
    );
}
