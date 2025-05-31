import { ToastContext } from "@/contexts/toastContext";
import { useContext } from "react";

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within an ToastContext");
    }
    return context;
};