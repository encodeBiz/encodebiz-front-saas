import { ThemeContext } from "@/contexts/themeContext";
import { useContext } from "react";

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useAppTheme must be used within an ThemeProvider");
    }
    return context;
};