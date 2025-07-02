"use client";

import PageLoader from "@/components/common/PageLoader";
import { createContext, useContext, useEffect, useState } from "react";

interface ILayout {
    openDraw: boolean;
}

interface LayoutContextType {
    layoutState: ILayout;
    changeLayoutState: (layout: ILayout) => void;
    changeLoaderState: (loader: { show: boolean, args?: any }) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [layoutState, setLayoutState] = useState<ILayout>({ openDraw: true });
    const [loader, setLoader] = useState<{ show: boolean, args?: any }>({ show: false });

    const changeLayoutState = (layout: ILayout) => {
        setLayoutState({ ...layout })
    }

    const changeLoaderState = (loader: { show: boolean, args?: any }) => {
        setLoader({ ...loader })
    }

    return (
        <LayoutContext.Provider value={{ layoutState, changeLayoutState, changeLoaderState }}>
            {loader.show && <PageLoader backdrop message={loader.args.text} type={'circular'} fullScreen={true} />}
            {children}
        </LayoutContext.Provider>
    );
};

