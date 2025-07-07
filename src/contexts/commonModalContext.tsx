"use client";

import { useAuth } from "@/hooks/useAuth";
import { createContext, useContext, useEffect, useState } from "react";

export enum CommonModalType {
    ONBOARDING = 'ONBOARDING',
    DELETE = 'DELETE',
    FILES = 'FILES'
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
    const closeModal = (type: CommonModalType = CommonModalType.ONBOARDING,) => {
        setOpen({ open: false, type })
        if (type === CommonModalType.ONBOARDING)
            localStorage.setItem('view-onboarding-' + user?.id, '1')
    }
    const openModal = (type: CommonModalType = CommonModalType.ONBOARDING, args?: any) => setOpen({ open: true, type, args })

    return (
        <CommonModalContext.Provider value={{ open, openModal, closeModal }}>
            {children}
        </CommonModalContext.Provider>
    );
};

