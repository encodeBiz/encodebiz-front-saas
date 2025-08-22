/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { createContext, useState, useRef, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type ToastMessage = {
    message: string;
    severity: AlertColor;
    key: number;
};

type ToastContextType = {
    showToast: (message: string, severity?: AlertColor) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<ToastMessage | undefined>(undefined);
    const queueRef = useRef<ToastMessage[]>([]);

 
    const showToast = (message: string, severity: AlertColor = 'info') => {
        const key = new Date().getTime();
        const newToast = { message, severity, key };
        if (open) {
            queueRef.current.push(newToast);
        } else {
            setMessageInfo(newToast);
            setOpen(true);
        }
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar                 
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={messageInfo?.severity || 'info'}
                    sx={{ width: '100%' }}
                >
                    {messageInfo?.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};

