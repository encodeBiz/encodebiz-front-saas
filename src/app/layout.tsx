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
import { MediaProvider } from "@/contexts/mediaContext";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "EncodeBiz Platform SaaS",
    description: "EncodeBiz Platform SaaS",
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
                        <ToastProvider>
                            <EntityProvider>
                                <LayoutProvider>
                                    <ThemeProvider>

                                        <CommonModalProvider>
                                            <MediaProvider>
                                                <NextTopLoader showSpinner={false} color="#456456" />
                                                {children}
                                            </MediaProvider>
                                        </CommonModalProvider>

                                    </ThemeProvider>
                                </LayoutProvider>
                            </EntityProvider>
                        </ToastProvider>
                    </AuthProvider>
                </LocaleProvider>
            </body>
        </html>
    );
}
