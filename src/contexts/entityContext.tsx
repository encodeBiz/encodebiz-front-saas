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
import { fetchServiceList, fetchSuscriptionByEntity } from "@/services/common/subscription.service";
import { IEntitySuscription } from "@/domain/auth/ISubscription";

interface EntityContextType {
    currentEntity: IUserEntity | undefined;
    entityList: Array<IUserEntity> | [];
    setCurrentEntity: (currentEntity: IUserEntity | undefined) => void;
    changeCurrentEntity: (id: string, callback?: Function) => void;
    refrestList: (userId: string) => void;
    entityServiceList: Array<IService>
    entitySuscription: Array<IEntitySuscription>

}
export const EntityContext = createContext<EntityContextType | undefined>(undefined);
export const EntityProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentEntity, setCurrentEntity] = useState<IUserEntity | undefined>(undefined);
    const [entityList, setEntityList] = useState<Array<IUserEntity>>([]);
    const [entityServiceList, setEntityServiceList] = useState<Array<IService>>([]);
    const [entitySuscription, setEntitySuscription] = useState<Array<IEntitySuscription>>([])
    const { push } = useRouter()


    const fetchSuscriptionEntity = async () => {
        const serviceSuscription: Array<IEntitySuscription> = await fetchSuscriptionByEntity(currentEntity?.entity.id as string)
        setEntitySuscription(serviceSuscription)
        const serviceList: Array<IService> = await fetchServiceList()
        setEntityServiceList(serviceList.map(e => ({ ...e, isBillingActive: !!serviceSuscription.find(service => service.serviceId === e.id) })))
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


    useEffect(() => {
        if (currentEntity?.entity.id)
            fetchSuscriptionEntity()
    }, [currentEntity?.entity.id])


    return (
        <EntityContext.Provider value={{ entityList, entitySuscription, entityServiceList, currentEntity, refrestList, setCurrentEntity, changeCurrentEntity }}>
            {children}
        </EntityContext.Provider>
    );
};


