import { LocaleContext } from "@/contexts/localeContext";
import { useContext } from "react";

export const useAppLocale = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error("useAppLocale must be used within an LocaleContext");
    }
    return context;
};