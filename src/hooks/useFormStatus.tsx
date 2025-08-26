import { FormStatusContext } from "@/contexts/formStatusContext";
import { useContext } from "react";

export const useFormStatus = () => {
    const context = useContext(FormStatusContext);
    if (!context) {
        throw new Error("useFormStatus must be used within an FormStatusProvider");
    }
    return context;
};