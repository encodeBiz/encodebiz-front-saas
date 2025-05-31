// Updated ToastContext.tsx with queue
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

type ToastMessage = {
    message: string;
    severity: AlertColor;
    key: number;
};

type ToastContextType = {
    showToast: (message: string, severity?: AlertColor) => void;
};

export const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState<ToastMessage | undefined>(undefined);
    const queueRef = useRef<ToastMessage[]>([]);

    const processQueue = () => {
        if (queueRef.current.length > 0) {
            setMessageInfo(queueRef.current.shift());
            setOpen(true);
        }
    };

    const showToast = (message: string, severity: AlertColor = 'info') => {
        const key = new Date().getTime();
        const newToast = { message, severity, key };

        if (open) {
            queueRef.current.push(newToast);
        } else {
            setMessageInfo(newToast);
            setOpen(true);
        }
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        processQueue();
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                key={messageInfo?.key}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionProps={{ onExited: handleExited }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export const useToast = () => useContext(ToastContext);