import { EntityContext } from "@/contexts/entityContext";
import { useContext } from "react";

export const useEntity = () => {
    const context = useContext(EntityContext);
    if (!context) {
        throw new Error("useEntity must be used within an EntityProvider");
    }
    return context;
};