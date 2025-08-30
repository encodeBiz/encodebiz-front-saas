import { TableStatusContext } from "@/contexts/tableStatusContext";
import { useContext } from "react";

export const useTableStatus = () => {
    const context = useContext(TableStatusContext);
    if (!context) {
        throw new Error("useTableStatus must be used within an TableStatusProvider");
    }
    return context;
};