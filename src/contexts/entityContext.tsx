"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import IEntity from "@/types/auth/IEntity";
import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { User } from "firebase/auth";

interface EntityContextType {
    currentEntity: IEntity | null;
    entityList: Array<IEntity> | [];
    setCurrentEntity: (currentEntity: IEntity | null) => void;

}
export const EntityContext = createContext<EntityContextType | undefined>(undefined);
export const EntityProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentEntity, setCurrentEntity] = useState<IEntity | null>(null);
    const [entityList, setEntityList] = useState<Array<IEntity>>([]);
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(async (userEntity: User) => {
            //Fetch Current and List entity of user session
        });
        return () => unsubscribe();
    }, []);

    return (
        <EntityContext.Provider value={{ entityList, currentEntity, setCurrentEntity }}>
            {children}
        </EntityContext.Provider>
    );
};


