"use client";

import { createContext, useEffect, useState } from "react";

import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { User } from "firebase/auth";
import IUserEntity from "@/domain/auth/IUserEntity";
import { useRouter } from "nextjs-toploader/app";
import { fetchUserEntities, saveStateCurrentEntity } from "@/services/common/entity.service";
import IUser from "@/domain/auth/IUser";
import { fetchUserAccount } from "@/services/common/account.service";
import { MAIN_ROUTE, GENERAL_ROUTE } from "@/config/routes";
import { IService } from "@/domain/core/IService";
import { fetchServiceList } from "@/services/common/subscription.service";

interface EntityContextType {
    currentEntity: IUserEntity | undefined;
    entityList: Array<IUserEntity> | [];
    setCurrentEntity: (currentEntity: IUserEntity | undefined) => void;
    changeCurrentEntity: (id: string, callback?: Function) => void;
    refrestList: (userId: string) => void;
    entityServiceList:Array<IService>

}
export const EntityContext = createContext<EntityContextType | undefined>(undefined);
export const EntityProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentEntity, setCurrentEntity] = useState<IUserEntity | undefined>(undefined);
    const [entityList, setEntityList] = useState<Array<IUserEntity>>([]);
    const [entityServiceList, setEntityServiceList] = useState<Array<IService>>([]);
    const { push } = useRouter()

    const fetchingServiceListState = async () => {
        setEntityServiceList(await fetchServiceList())
    }

    const watchSesionState = async (userAuth: User) => {
        if (userAuth) {
            const entityList: Array<IUserEntity> = await fetchUserEntities(userAuth.uid)

            if (entityList.length > 0) {
                if (entityList.length > 0 && entityList.filter(e => e.isActive).length === 0) {
                    const item = entityList[0]
                    item.isActive = true
                    entityList.splice(0, 1, item)
                }
                setEntityList(entityList)
                setCurrentEntity(entityList.find(e => e.isActive) as IUserEntity)
                fetchingServiceListState()
            } else {
                const userData: IUser = await fetchUserAccount(userAuth.uid)
                if (userData.email)
                    push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
            }
        }
    }

    const refrestList = async (userId: string) => {
        const entityList: Array<IUserEntity> = await fetchUserEntities(userId)

        if (entityList.length > 0) {
            if (entityList.length > 0 && entityList.filter(e => e.isActive).length === 0) {
                const item = entityList[0]
                item.isActive = true
                entityList.splice(0, 1, item)
            }

            setEntityList(entityList)
            setCurrentEntity(entityList.find(e => e.isActive) as IUserEntity)
            fetchingServiceListState()
        } else {
            push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
        }
    }


    const changeCurrentEntity = async (id: string, callback?: Function) => {
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
            await saveStateCurrentEntity(updatedList)

            setTimeout(() => {
                if (typeof callback === 'function') callback()
            }, 1000);
        }
    }

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges(watchSesionState);
        return () => unsubscribe();
    }, []);

    return (
        <EntityContext.Provider value={{ entityList, entityServiceList, currentEntity, refrestList, setCurrentEntity, changeCurrentEntity }}>
            {children}
        </EntityContext.Provider>
    );
};


