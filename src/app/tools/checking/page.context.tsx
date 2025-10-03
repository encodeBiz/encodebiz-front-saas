/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { CommonModalType } from '@/contexts/commonModalContext';
import IEntity from '@/domain/core/auth/IEntity';
import { IChecklog, ICreateLog } from '@/domain/features/checkinbiz/IChecklog';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useLayout } from '@/hooks/useLayout';
import { useToast } from '@/hooks/useToast';
import { rmNDay } from '@/lib/common/Date';
import { getEmplyeeLogs, createLog, validateEmployee, getEmplyeeLogsState } from '@/services/checkinbiz/employee.service';
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
    openLogs: boolean
    setOpenLogs: (openLogs: boolean) => void
    createLogAction: (type: "checkout" | "checkin" | "restin" | "restout", callback?: () => void) => void
    employeeLogs: Array<IChecklog>
    range: { start: any, end: any }
    setRange: (range: { start: any, end: any }) => void,
    entity: IEntity | undefined
    employee: string | undefined
    getEmplyeeLogsData: (range: { start: any, end: any }) => void
    branchList: Array<{ name: string, branchId: string }>
    sessionData: { employeeId: string, entityId: string, branchId: string, } | undefined
    setSessionData: (data: { employeeId: string, entityId: string, branchId: string, }) => void
    token: string
    setToken: (token: string) => void
}


export const CheckContext = createContext<CheckType | undefined>(undefined);

export function CheckProvider({ children }: { children: React.ReactNode }) {
    const t = useTranslations()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()


    const [checkAction, setCheckAction] = useState<"checkout" | "checkin">('checkout')
    const [restAction, setRestAction] = useState<"restout" | "restin">('restout')
    const [openLogs, setOpenLogs] = useState(false)
    const [token, setToken] = useState('')
    const [pending, setPending] = useState(false)
    const [pendingStatus, setPendingStatus] = useState(false)

    const [entity, setEntity] = useState<IEntity>()
    const [employee, setEmployee] = useState<string>()
    const [geo, setGeo] = useState<{ latitude: number, longitude: number }>({ latitude: 0, longitude: 0 })
    const [employeeLogs, setEmployeeLogs] = useState<Array<IChecklog>>([])
    const searchParams = useSearchParams()
    const customToken = searchParams.get('customToken') || token;
    const [range, setRange] = useState<{ start: any, end: any }>({ start: rmNDay(new Date(), 1), end: new Date() })
    const { openModal } = useCommonModal()

    const [branchList, setBranchList] = useState<Array<{ name: string, branchId: string }>>([])
    const [sessionData, setSessionData] = useState<{ employeeId: string, entityId: string, branchId: string, }>()

    const getCurrenGeo = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setGeo(position.coords as { latitude: number, longitude: number })
                },
                (error) => showToast('Error getting user location: ' + error, 'error')
            );
        }
        else showToast('Geolocation is not supported by this browser.', 'error');
    }


    const handleValidateEmployee = async () => {
        try {
            setPendingStatus(true)
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            const response: IValidateEmployeData = await validateEmployee(customToken as string)
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
            setEmployee(response.payload.name as string)

            if (!response.payload.twoFa) {
                openModal(CommonModalType.CONFIG2AF)
            } else {
                if (data.length > 0) {
                    openModal(CommonModalType.BRANCH_SELECTED)
                    getLastState(response.payload.entityId, response.payload.employeeId)
                }
            }

            setToken(response.sessionToken)
            changeLoaderState({ show: false })

        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')

        }
    }

    const getEmplyeeLogsData = async (range: { start: any, end: any }) => {

        try {
            const filters = [
                { field: 'timestamp', operator: '>=', value: new Date(range.start) },
                { field: 'timestamp', operator: '<=', value: new Date(range.end) },
            ]

            const resultList: Array<IChecklog> = await getEmplyeeLogs(sessionData?.entityId || '', sessionData?.employeeId || '', sessionData?.branchId || '', { limit: 50, orderBy: 'timestamp', orderDirection: 'desc', filters } as any) as Array<IChecklog>


            const data = await Promise.all(
                resultList.map(async (item) => {
                    const branchId = (await fetchSucursal(item.entityId, item.branchId))?.name
                    return {
                        ...item,
                        branchId
                    };
                })
            );

            setEmployeeLogs(data)
        } catch (error) {
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    const getLastState = async (entityId: string, employeeId: string) => {
        try {
            const resultList: Array<IChecklog> = await getEmplyeeLogsState(entityId, employeeId, { limit: 10, orderBy: 'timestamp', orderDirection: 'desc' } as any) as Array<IChecklog>
            if (resultList.length > 0) {
                const last = resultList[0]

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
                setPendingStatus(false)

            }
        } catch (error) {
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    const createLogAction = (type: "checkout" | "checkin" | "restin" | "restout", callback?: () => void) => {
        if (!sessionData?.branchId && branchList.length > 0)
            openModal(CommonModalType.BRANCH_SELECTED)
        else {
            const data: ICreateLog = {
                "employeeId": sessionData?.employeeId as string,
                "entityId": sessionData?.entityId as string,
                "branchId": sessionData?.branchId as string,
                type,
                "geo": {
                    "lat": geo.latitude,
                    "lng": geo.longitude
                }
            }
            setPending(true);
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })

            createLog(data, token).then(() => {
                getEmplyeeLogsData(range)
                if (typeof callback === 'function') callback()

            }).catch(e => {
                
                if (e?.message?.includes('Dispositivo no confiable')) {
                    openModal(CommonModalType.ADDDEVICE2AF)
                }

                showToast(e?.message, 'error')
            }).finally(() => {
                changeLoaderState({ show: false })
            })
        }
    }

    const fetchEntityData = async () => {
        setEntity(await fetchEntity(sessionData?.entityId as string))
    }



    useEffect(() => {
        getCurrenGeo()
        fetchEntityData()
    }, [sessionData?.entityId])

    useEffect(() => {
        if (customToken) handleValidateEmployee()
    }, [customToken])





    return (
        <CheckContext.Provider value={{pendingStatus,
            setSessionData, sessionData, setToken,
            entity, employee, branchList, token,
            pending, checkAction, setCheckAction, restAction, setRestAction, setOpenLogs, openLogs, createLogAction, employeeLogs, range, setRange, getEmplyeeLogsData
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