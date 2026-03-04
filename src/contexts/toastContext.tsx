'use client'
import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
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
    const openRef = useRef(false);

    // Mantiene una referencia sincronizada del estado `open` para que showToast
    // pueda ser estable sin depender de él en la lista de dependencias.
    useEffect(() => {
        openRef.current = open;
    }, [open]);

    const processQueue = useCallback(() => {
        if (queueRef.current.length > 0) {
            setMessageInfo(queueRef.current.shift());
            setOpen(true);
        }
    }, []);

    const showToast = useCallback((message: string, severity: AlertColor = 'info') => {
        const key = new Date().getTime();
        queueRef.current.push({ message, severity, key });

        // Si ya hay un toast visible lo cerramos para que se ejecute `processQueue`
        // al finalizar la animación y muestre el siguiente mensaje.
        if (openRef.current) {
            setOpen(false);
            return;
        }

        processQueue();
    }, [processQueue]);

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
                key={messageInfo?.key}
                TransitionProps={{
                    onExited: processQueue,
                }}
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
