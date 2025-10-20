"use client";

import PageLoader from "@/components/common/PageLoader";
import { MAIN_ROUTE } from "@/config/routes";
import IUserEntity from "@/domain/core/auth/IUserEntity";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserEntities } from "@/services/core/entity.service";
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
    navivateTo: (path: string, forceFindEntityId?: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [layoutState, setLayoutState] = useState<ILayout>({ openDraw: true });
    const [loader, setLoader] = useState<{ show: boolean, args?: any }>({ show: false });
    const { push } = useRouter()
    const { entityId } = useParams<any>()
    const { user } = useAuth()
    const { currentLocale } = useAppLocale()
    const navivateTo = async (path: string, forceFindEntityId: boolean = false) => {
        if (entityId)
            push(`/${MAIN_ROUTE}/${entityId}/${path}`)
        else
            if (forceFindEntityId && user?.id) {
                const entityList: Array<IUserEntity> = await fetchUserEntities(user?.id as string, currentLocale)
                const current: IUserEntity = entityList.find(e => e.isActive) as IUserEntity
                push(`/${MAIN_ROUTE}/${current.entity.id}/${path}`)
            } else
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

