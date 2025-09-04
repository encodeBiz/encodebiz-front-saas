"use client";

import { useAuth } from "@/hooks/useAuth";
import { createContext, useCallback, useState } from "react";

export enum CommonModalType {
    ONBOARDING = 'ONBOARDING',
    DELETE = 'DELETE',
    FILES = 'FILES',
    SEND = 'SEND',
    BILLING = 'BILLING',
    RECOVERY = 'RECOVERY',
    CONFIG_CSV = 'CONFIG_CSV',
    UPLOAD_CSV = 'UPLOAD_CSV',
    REACTIVE = 'REACTIVE',
    ARCHIVED = 'ARCHIVED',
    EVENT_SELECTED = 'EVENT_SELECTED',
    CONTACT = 'CONTACT',
    INFO = 'INFO',
    WEBHOOK = 'WEBHOOK',
}
interface CommonModalContextType {
    open: { type: CommonModalType, open: boolean, args?: any }
    closeModal: (type?: CommonModalType) => void
    openModal: (type?: CommonModalType, args?: any) => void
}
export const CommonModalContext = createContext<CommonModalContextType | undefined>(undefined);
export const CommonModalProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    const [open, setOpen] = useState<{ type: CommonModalType, open: boolean, args?: any }>({ open: false, type: CommonModalType.ONBOARDING, args: {} })
    const closeModal = useCallback((type: CommonModalType = CommonModalType.ONBOARDING,) => {
        setOpen({ open: false, type })
        if (type === CommonModalType.ONBOARDING)
            localStorage.setItem('view-onboarding-' + user?.id, '1')
    }, [user?.id])
    const openModal = useCallback((type: CommonModalType = CommonModalType.ONBOARDING, args?: any) => setOpen({ open: true, type, args })
        , [])

    return (
        <CommonModalContext.Provider value={{ open, openModal, closeModal }}>
            {children}
        </CommonModalContext.Provider>
    );
};

