/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { CommonModalType } from '@/contexts/commonModalContext';
import IEntity from '@/domain/core/auth/IEntity';
import { IChecklog, ICreateLog } from '@/domain/features/checkinbiz/IChecklog';
import { IEmployee } from '@/domain/features/checkinbiz/IEmployee';
import { ISucursal } from '@/domain/features/checkinbiz/ISucursal';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useGeoPermission } from '@/hooks/useGeoPermission';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import { createLog, validateEmployee, getEmplyeeLogsState, fetchEmployee } from '@/services/checkinbiz/employee.service';
import { fetchSucursal } from '@/services/checkinbiz/sucursal.service';
import { fetchEntity } from '@/services/core/entity.service';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IValidateEmployeData {
    "message": string
    "payload": {
        "name": string
        "employeeId": string
        "twoFa": boolean
        "trustedDevicesId": boolean
        "entityId": string
    },
    "sessionToken": string
    "expiresAt": any,
    "branchId": [
        string
    ]
}

interface CheckType {
    pendingStatus: boolean
    pending: boolean
    checkAction: "checkout" | "checkin"
    setCheckAction: (checkAction: "checkout" | "checkin") => void
    restAction: "restout" | "restin",
    setRestAction: (restAction: "restout" | "restin") => void

    createLogAction: (type: "checkout" | "checkin" | "restin" | "restout", callback?: () => void) => void

    entity: IEntity | undefined
    employee: IEmployee | undefined
    branchList: Array<{ name: string, branchId: string }>
    sessionData: { employeeId: string, entityId: string, branchId: string, } | undefined
    setSessionData: (data: { employeeId: string, entityId: string, branchId: string, }) => void
    token: string
    setToken: (token: string) => void

    currentBranch: ISucursal | undefined
    hanldeSelectedBranch: (sucursalId: string) => void
    handleRequestLocation: () => void
}


export const CheckContext = createContext<CheckType | undefined>(undefined);

export function CheckProvider({ children }: { children: React.ReactNode }) {
    const t = useTranslations()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const { currentLocale } = useAppLocale()


    const [checkAction, setCheckAction] = useState<"checkout" | "checkin">('checkout')
    const [restAction, setRestAction] = useState<"restout" | "restin">('restout')

    const [token, setToken] = useState('')
    const [pending, setPending] = useState(false)
    const [pendingStatus, setPendingStatus] = useState(true)
    const { status, requestLocation } = useGeoPermission();

    const [entity, setEntity] = useState<IEntity>()
    const [employee, setEmployee] = useState<IEmployee>()
    const searchParams = useSearchParams()
    const customToken = searchParams.get('customToken') || token;
    const { openModal } = useCommonModal()
    const [currentBranch, setCurrentBranch] = useState<ISucursal>()

    const [branchList, setBranchList] = useState<Array<{ name: string, branchId: string }>>([])
    const [sessionData, setSessionData] = useState<{ employeeId: string, entityId: string, branchId: string, }>()



    const handleValidateEmployee = async () => {
        try {
            setPendingStatus(true)
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            const response: IValidateEmployeData = await validateEmployee(customToken as string, currentLocale)
            setSessionData({
                ...sessionData as { employeeId: string, entityId: string, branchId: string, },
                entityId: response.payload.entityId as string,
                employeeId: response.payload.employeeId as string
            })
            const data = await Promise.all(
                response?.branchId.map(async (item) => {
                    const branchId = (await fetchSucursal(response.payload.entityId, item))?.name
                    return { name: branchId || '', branchId: item };
                })
            );
            setBranchList(data)


            if (!response.payload.twoFa) {
                openModal(CommonModalType.CONFIG2AF)
            }
            getLastState(response.payload.entityId, response.payload.employeeId)
            setToken(response.sessionToken)
            changeLoaderState({ show: false })

        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')

        }
    }



    const getLastState = async (entityId: string, employeeId: string) => {
        try {
            const resultList: Array<IChecklog> = await getEmplyeeLogsState(entityId, employeeId, { limit: 10, orderBy: 'timestamp', orderDirection: 'desc' } as any) as Array<IChecklog>

            if (resultList.length > 0) {
                const last = resultList[0]

                const branch = (await fetchSucursal(last?.entityId as string, last.branchId))
                setCurrentBranch(branch)
                setSessionData({
                    branchId: last.branchId,
                    entityId: last.entityId,
                    employeeId: last.employeeId
                })


                if (last.type === 'checkin' || last.type === 'checkout') {
                    setCheckAction(last.type)
                    if (last.type === 'checkout') {
                        setRestAction('restout')
                    }
                }

                if (last.type === 'restin' || last.type === 'restout') {
                    setRestAction(last.type)
                    setCheckAction('checkin')
                }

            } else {
                setCheckAction('checkout')
                setRestAction('restout')
            }

            setPendingStatus(false)
        } catch (error) {
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    const hanldeSelectedBranch = async (sucursalId: string) => {
        const branch = (await fetchSucursal(sessionData?.entityId as string, sucursalId))
        setCurrentBranch(branch)
        createLogAction(checkAction === 'checkin' ? 'checkout' : 'checkin', () => {
            setCheckAction(checkAction === 'checkin' ? 'checkout' : 'checkin')
        }, sucursalId)
    }

    const handleCreateLog = (type: "checkout" | "checkin" | "restin" | "restout", callback?: () => void, sucursalId?: string, pos?: { lat: number, lng: number }) => {
        const data: ICreateLog = {
            "employeeId": sessionData?.employeeId as string,
            "entityId": sessionData?.entityId as string,
            "branchId": sucursalId ? sucursalId : sessionData?.branchId as string,
            type,
            "geo": {
                "lat": pos?.lat as number,
                "lng": pos?.lng as number
            }
        }

        createLog(data, token, currentLocale).then(() => {
            if (typeof callback === 'function') callback()
        }).catch(e => {
            const errorData: { code: string, message: string } = JSON.parse(e?.message) as { code: string, message: string }
            if (errorData.code === 'checklog/out_of_radius') {
                openModal(CommonModalType.OUT_RADIUS)
            } else {
                if (errorData.code === 'auth/untrusted_device') {
                    openModal(CommonModalType.ADDDEVICE2AF)
                } else {
                    showToast(errorData.message, 'error')
                }
            }






        }).finally(() => {
            changeLoaderState({ show: false })
        })
    }

    const createLogAction = (type: "checkout" | "checkin" | "restin" | "restout", callback?: () => void, sucursalId?: string) => {
        setPending(true);
        changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })

        if (employee?.enableRemoteWork)
            handleCreateLog(type, callback, sucursalId, { lat: 0, lng: 0 })
        else
            requestLocation().then(pos => {
                handleCreateLog(type, callback, sucursalId, pos as { lat: number, lng: number })
            }).catch(err => {
                setPending(false);
                changeLoaderState({ show: false })
                showToast(err?.message, 'error')
            })
    }

    const fetchEntityData = async () => {
        setEntity(await fetchEntity(sessionData?.entityId as string,currentLocale))
    }

    const fetchEmployeeData = async () => {
        setEmployee(await fetchEmployee(sessionData?.entityId as string, sessionData?.employeeId as string))
    }



    useEffect(() => {
        if (sessionData?.entityId) {
            fetchEntityData()
            fetchEmployeeData()
        }
    }, [sessionData?.entityId])

    useEffect(() => {
        if (customToken) {
            handleValidateEmployee()
        }
    }, [customToken])


    useEffect(() => {
        if (status === "denied" || status === "prompt") {
            openModal(CommonModalType.GEO)
        }
    }, [status])



    const handleRequestLocation = async () => await requestLocation()

    return (
        <CheckContext.Provider value={{
            pendingStatus, currentBranch, hanldeSelectedBranch,
            setSessionData, sessionData, setToken, handleRequestLocation,
            entity, employee, branchList, token,
            pending, checkAction, setCheckAction, restAction, setRestAction, createLogAction
        }}>
            {children}
        </CheckContext.Provider>
    );
}


export const useCheck = () => {
    const context = useContext(CheckContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

/**
 * 
 * {
    "message": "Código 2FA verificado correctamente",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiZTFveXFFV1ZzZVhNc3BraGZuYloiLCJlbnRpdHlJZCI6ImsyNHJweHpZN2FVVEFtU1hqTnlUIiwicHVycG9zZSI6IjJmYS1hdXRob3JpemF0aW9uIiwiaWF0IjoxNzU5MjU2NDQ3LCJleHAiOjE3NTkyNTY3NDd9.K2VvoDPR9RBLnsnQ4ZSg-_knWpqmcSfjIp9DqyCl_yc",
    "expiresIn": 300
}
 */