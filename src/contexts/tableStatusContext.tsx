"use client";

import { createContext, useState } from "react";

interface ITableStatus {
    status: any
    id: string
}

interface TableStatusContextType {
    tableStatus: ITableStatus | undefined
    updateFromStatus: (TableStatus: ITableStatus) => void

}
export const TableStatusContext = createContext<TableStatusContextType | undefined>(undefined);
export const TableStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [tableStatus, updateFromStatus] = useState<ITableStatus>()

    return (
        <TableStatusContext.Provider value={{ tableStatus, updateFromStatus }}>
            {children}
        </TableStatusContext.Provider>
    );
};

