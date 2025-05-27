"use client";

import { createContext, useContext, useEffect, useState } from "react";
 
interface ILayout {
    openDraw: boolean;
}

interface LayoutContextType {
    layoutState: ILayout;
    changeLayoutState: (layout: ILayout) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [layoutState, setLayoutState] = useState<ILayout>({ openDraw: true });
    const changeLayoutState = (layout: ILayout) => {        
            setLayoutState({ ...layout })
    }

    return (
        <LayoutContext.Provider value={{ layoutState, changeLayoutState }}>    
            {children}
        </LayoutContext.Provider>
    );
};

