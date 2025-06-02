"use client";

import { createContext, useEffect, useState } from "react";

import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { User } from "firebase/auth";
import IUserEntity from "@/types/auth/IUserEntity";
import { fetchUserEntities, saveStateCurrentEntity } from "@/services/common/account.service";

interface EntityContextType {
    currentEntity: IUserEntity | undefined;
    entityList: Array<IUserEntity> | [];
    setEntityList: (entityList: Array<IUserEntity>) => void;
    setCurrentEntity: (currentEntity: IUserEntity | undefined) => void;
    changeCurrentEntity: (id: string) => void;
}
export const EntityContext = createContext<EntityContextType | undefined>(undefined);
export const EntityProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentEntity, setCurrentEntity] = useState<IUserEntity | undefined>(undefined);
    const [entityList, setEntityList] = useState<Array<IUserEntity>>([]);

    const watchSesionState = async (userAuth: User) => {
        if (userAuth) {
            const entityList: Array<IUserEntity> = await fetchUserEntities(userAuth.uid)
            if (entityList.length == 1) {
                const item = entityList[0]
                item.isActive = true
                entityList.splice(0, 1, item)
            }
            setEntityList(entityList)
            setCurrentEntity(entityList.find(e => e.isActive) as IUserEntity)
        }
    }


    const changeCurrentEntity = async (id: string) => {
        const current: IUserEntity = entityList.find(e => e.id === id) as IUserEntity
        if (current) {
            const updatedList: Array<IUserEntity> = []
            entityList.forEach(element => {
                if (current.id === element.id)
                    element.isActive = true
                else
                    element.isActive = false
                updatedList.push(element)
            })
            setEntityList(updatedList)
            setCurrentEntity(current)
            saveStateCurrentEntity(updatedList)
        }
    }

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(watchSesionState);
        return () => unsubscribe();
    }, []);

    return (
        <EntityContext.Provider value={{ entityList, currentEntity, setEntityList, setCurrentEntity, changeCurrentEntity }}>
            {children}
        </EntityContext.Provider>
    );
};


