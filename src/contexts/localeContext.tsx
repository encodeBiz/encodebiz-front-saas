'use client'
import { NextIntlClientProvider } from 'next-intl';
import React, { createContext, useEffect, useMemo, useState } from 'react';

import messagesDe from '../../locales/de/common.json';
import messagesEs from '../../locales/es/common.json';
import messagesEn from '../../locales/en/common.json';
import messagesFr from '../../locales/fr/common.json';

const allMessages: any = {
    en: messagesEn,
    es: messagesEs,
    fr: messagesFr,
    de: messagesDe,
};

interface LocaleType {
    changeLocale: (locale: 'es' | 'en' | 'de' | 'fr' | string) => void;
    currentLocale: 'es' | 'en' | 'de' | 'fr' | string
}

export const LocaleContext = createContext<LocaleType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {

    const currentLocale = 'es'
    const [locale, setLocale] = useState<'es' | 'en' | 'de' | 'fr' | string>(currentLocale);
    const messages = useMemo(() => {
        return allMessages[locale as keyof typeof allMessages] || allMessages[currentLocale as string];
    }, [currentLocale, locale]);

    const changeLocale = (locale: 'es' | 'en' | 'de' | 'fr' | string) => {
        setLocale(locale);
    };

    useEffect(() => {
        localStorage.setItem('lang', locale)
    }, [locale])



    return (
        <LocaleContext.Provider value={{ changeLocale, currentLocale: locale }}>
            <NextIntlClientProvider timeZone='Europe/Madrid' locale={locale} messages={messages}>
                {children}
            </NextIntlClientProvider>
        </LocaleContext.Provider>
    );
}