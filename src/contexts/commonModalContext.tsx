"use client";
import { createContext, useCallback, useState } from "react";

export enum CommonModalType {
    ONBOARDING = 'ONBOARDING',
    WELCOMEGUEST = 'WELCOMEGUEST',
    DELETE = 'DELETE',
    CHECKLOGFORM = 'CHECKLOGFORM',
    REPORTFORM = 'REPORTFORM',
    FILES = 'FILES',
    GEO = 'GEO',
    SEND = 'SEND',
    ISSUES = "ISSUES",
    ISSUES_RESPONSE = "ISSUES_RESPONSE",
    BILLING = 'BILLING',
    RECOVERY = 'RECOVERY',
    CONFIG_CSV = 'CONFIG_CSV',
    UPLOAD_CSV = 'UPLOAD_CSV',
    REACTIVE = 'REACTIVE',
    ARCHIVED = 'ARCHIVED',
    EVENT_SELECTED = 'EVENT_SELECTED',
    BRANCH_SELECTED = 'BRANCH_SELECTED',
    CONTACT = 'CONTACT',
    COLABORATOR = 'COLABORATOR',
    INFO = 'INFO',
    WEBHOOK = 'WEBHOOK',
    FORM = 'FORM',
    ADDDEVICE2AF = 'ADDDEVICE2AF',
    OUT_RADIUS = 'OUT_RADIUS',
    CONFIG2AF = 'CONFIG2AF',
    LOGS = 'LOGS',
    UPDATEREQUEST = 'UPDATEREQUEST',
    CONFIRMUPDATE="CONFIRMUPDATE"
}
interface CommonModalContextType {
    open: { type: CommonModalType, open: boolean, args?: any }
    closeModal: (type?: CommonModalType) => void
    openModal: (type?: CommonModalType, args?: any) => void
}
export const CommonModalContext = createContext<CommonModalContextType | undefined>(undefined);
export const CommonModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<{ type: CommonModalType, open: boolean, args?: any }>({ open: false, type: CommonModalType.ONBOARDING, args: {} })
    const closeModal = (type: CommonModalType = CommonModalType.ONBOARDING,) => {
        setOpen({ open: false, type })
    }
    const openModal = useCallback((type: CommonModalType = CommonModalType.ONBOARDING, args?: any) => setOpen({ open: true, type, args })
        , [])

    return (
        <CommonModalContext.Provider value={{ open, openModal, closeModal }}>
            {children}
        </CommonModalContext.Provider>
    );
};

