/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { createContext, useEffect, useState, useCallback } from "react";
import { subscribeToAuthChanges } from "@/lib/firebase/authentication/stateChange";
import { User } from "firebase/auth";
import IUserEntity from "@/domain/core/auth/IUserEntity";
import { fetchUserEntities, saveStateCurrentEntity, watchEntityChange } from "@/services/core/entity.service";
import IUser from "@/domain/core/auth/IUser";
import { fetchUserAccount } from "@/services/core/account.service";
import { GENERAL_ROUTE, MAIN_ROUTE, PUBLIC_PATH } from "@/config/routes";
import { BizType, IService } from "@/domain/core/IService";
import { fetchServiceList, fetchSuscriptionByEntity, watchSubscrptionEntityChange } from "@/services/core/subscription.service";
import { IEntitySuscription } from "@/domain/core/auth/ISubscription";
import { useToast } from "@/hooks/useToast";
import { Unsubscribe } from "firebase/firestore";
import IEntity from "@/domain/core/auth/IEntity";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useAppLocale } from "@/hooks/useAppLocale";

interface EntityContextType {
    currentEntity: IUserEntity | undefined;
    entityList: Array<IUserEntity> | [];
    setCurrentEntity: (currentEntity: IUserEntity | undefined) => void;
    changeCurrentEntity: (id: string, userId: string, callback?: () => void) => void;
    refrestList: (userId: string) => void;
    entityServiceList: Array<IService>
    entitySuscription: Array<IEntitySuscription>
    watchServiceAccess: (serviceId: BizType) => void
    cleanEntityContext: () => void


}
export const EntityContext = createContext<EntityContextType | undefined>(undefined);
export const EntityProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentEntity, setCurrentEntity] = useState<IUserEntity | undefined>(undefined);
    const [entityList, setEntityList] = useState<Array<IUserEntity>>([]);
    const [entityServiceList, setEntityServiceList] = useState<Array<IService>>([]);
    const [entitySuscription, setEntitySuscription] = useState<Array<IEntitySuscription>>([])
    const { push } = useRouter()
    const { showToast } = useToast()
    const pathname = usePathname()
    const { changeLocale } = useAppLocale()
    const { entityId } = useParams<any>()

    const watchServiceAccess = useCallback(async (serviceId: BizType) => {
        const serviceSuscription: Array<IEntitySuscription> = await fetchSuscriptionByEntity(currentEntity?.entity.id as string)
        const check = serviceSuscription.find(e => e.serviceId === serviceId && currentEntity?.entity.id === e.entityId && e.status !== "cancelled" && e.status !== "pending-pay")
        if (!check) {
            showToast('No tiene permiso para acceder a este recurso', 'info')
            push(`/${MAIN_ROUTE}/${entityId}/${serviceId}/onboarding`)
        }
    }, [currentEntity?.entity.id])

    const fetchEntitySuscription = async () => {
        const serviceSuscription: Array<IEntitySuscription> = await fetchSuscriptionByEntity(currentEntity?.entity.id as string)
        setEntitySuscription(serviceSuscription.filter(e => e.status !== "cancelled" && e.status !== "pending-pay"))
        const serviceList: Array<IService> = await fetchServiceList()
        setEntityServiceList(serviceList.sort((a, b) => a.order - b.order).map(e => ({ ...e, isBillingActive: !!serviceSuscription.find(service => service.serviceId === e.id && service.status !== "cancelled" && service.status !== "pending-pay") })))

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
                let _currentEntity: IUserEntity | null


                if (entityId) {
                    changeCurrentEntity(entityId, userAuth?.uid)
                } else {
                    _currentEntity = entityList.find(e => e.isActive) as IUserEntity

                    setCurrentEntity(_currentEntity)
                    const extraData = await fetchUserAccount(userAuth.uid)
                    if (extraData.fullName !== "Guest")
                        push(`/${MAIN_ROUTE}/${_currentEntity.entity.id}/dashboard`)

                }

            } else {
                try {
                    const userData: IUser = await fetchUserAccount(userAuth.uid)
                    if (userData.email)
                        push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
                } catch (error) {
                    if (error instanceof Error) {
                        showToast(error.message, 'error');
                    } else {
                        showToast('Unknown error', 'error');
                    }
                }

            }
        }
    };

    const refrestList = async (userId: string) => {
        const entityList: Array<IUserEntity> = await fetchUserEntities(userId)
        if (entityList.length > 0) {
            if (entityList.length > 0 && entityList.filter(e => e.isActive).length === 0) {
                const item = entityList[0]
                item.isActive = true
                entityList.splice(0, 1, item)
            }
            setEntityList(entityList)
            const entity = entityList.find(e => e.isActive) ?? entityList[0]
            changeCurrentEntity(entity.entity.id as string, userId)

        } else {
            push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
        }
    }


    const changeCurrentEntity = async (id: string, userId: string, callback?: () => void,) => {
        const entityList: Array<IUserEntity> = await fetchUserEntities(userId)
        const current: IUserEntity = entityList.find(e => e.entity.id === id) as IUserEntity
        console.log(current);

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

            push(`${pathname.replace(entityId, current.entity.id as string)}`)
            await saveStateCurrentEntity(updatedList)

            setTimeout(() => {
                if (typeof callback === 'function') callback()
            }, 1000);
        } else {
            const entityList: Array<IUserEntity> = await fetchUserEntities(userId)
            if (entityList.length > 0) {
                setEntityList(entityList)
                const entity = entityList.find(e => e.isActive) ?? entityList[0]
                changeCurrentEntity(entity.entity.id as string, userId)
            } else {
                push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity/create`)
            }
        }
    }

    const cleanEntityContext = async () => {
        setCurrentEntity(undefined);
        setEntityList([]);
        setEntityServiceList([]);
        setEntitySuscription([])
    }

    const watchSubcriptionState = () => {
        watchSubscrptionEntityChange(currentEntity?.entity.id as string, async () => {
            await fetchEntitySuscription()
        })
    }

    const watchEntityState = async (entity: IEntity) => {

        changeLocale(entity?.language?.toLowerCase() ?? 'es')
        const item = entityList.find(e => e.entity.id == entity.id && e.entity.active)
        const itemIndex = entityList.findIndex(e => e.entity.id == entity.id && e.entity.active)
        if (item) {
            item.entity = entity
            entityList.splice(itemIndex, 1, item)
            setEntityList(entityList)
        }
        setCurrentEntity(prev => ({ ...(prev as IUserEntity), entity }))
    }



    useEffect(() => {
        if (!PUBLIC_PATH.includes(pathname)) {
            const unsubscribe = subscribeToAuthChanges(watchSesionState);
            return () => unsubscribe();
        }
    }, []);


    useEffect(() => {
        let unsubscribe: Unsubscribe
        let unsubscribeEntity: Unsubscribe
        if (currentEntity?.entity.id) {
            unsubscribe = watchSubscrptionEntityChange(currentEntity?.entity.id, watchSubcriptionState);
            unsubscribeEntity = watchEntityChange(currentEntity?.entity.id, watchEntityState)
            fetchEntitySuscription()
        }
        return () => {
            if (typeof unsubscribe === 'function') unsubscribe()
            if (typeof unsubscribeEntity === 'function') unsubscribeEntity()
        };
    }, [currentEntity?.entity.id])


    return (
        <EntityContext.Provider value={{ entityList, cleanEntityContext, watchServiceAccess, entitySuscription, entityServiceList, currentEntity, refrestList, setCurrentEntity, changeCurrentEntity }}>
            {children}
        </EntityContext.Provider>
    );
};


