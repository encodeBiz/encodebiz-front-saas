import { CommonModalContext } from "@/contexts/commonModalContext";
import { useContext } from "react";

export const useCommonModal = () => {
    const context = useContext(CommonModalContext);
    if (!context) {
        throw new Error("useCommonModal must be used within an CommonModalProvider");
    }
    return context;
};