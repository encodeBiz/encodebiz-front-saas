import { MediaContext } from "@/contexts/mediaContext";
import { useContext } from "react";

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error("useMedia must be used within an MediaProvider");
    }
    return context;
};