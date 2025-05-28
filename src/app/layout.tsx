import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/contexts/themeContext";
import { LocaleProvider } from "@/contexts/localeContext";
import { LayoutProvider } from "@/contexts/layoutContext";
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
                    <LayoutProvider>
                        <ThemeProvider>{children}</ThemeProvider>
                    </LayoutProvider>
                </LocaleProvider>
            </body>
        </html>
    );
}
