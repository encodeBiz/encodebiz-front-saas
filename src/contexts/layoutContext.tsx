"use client";

import PageLoader from "@/components/common/PageLoader";
import { MAIN_ROUTE } from "@/config/routes";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { createContext, useCallback, useState } from "react";

interface ILayout {
    openDraw: boolean;
}

interface LayoutContextType {
    layoutState: ILayout;
    changeLayoutState: (layout: ILayout) => void;
    changeLoaderState: (loader: { show: boolean, args?: any }) => void;
    navivateTo: (path: string) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [layoutState, setLayoutState] = useState<ILayout>({ openDraw: true });
    const [loader, setLoader] = useState<{ show: boolean, args?: any }>({ show: false });
    const { push } = useRouter()
    const { entityId } = useParams<any>()

    const navivateTo = (path: string) => {
        if (entityId)
            push(`/${MAIN_ROUTE}/${entityId}/${path}`)
        else
            push(`/${MAIN_ROUTE}/${path}`)

    }
    const changeLayoutState = useCallback((layout: ILayout) => {
        setLayoutState({ ...layout })
    }, [])

    const changeLoaderState = useCallback((loader: { show: boolean, args?: any }) => {
        setLoader({ ...loader })
    }, [])

    return (
        <LayoutContext.Provider value={{ layoutState, changeLayoutState, changeLoaderState, navivateTo }}>
            {loader.show && <PageLoader backdrop message={loader.args.text} type={'circular'} fullScreen={true} />}
            {children}
        </LayoutContext.Provider>
    );
};

