/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { IChecklog, ICreateLog } from "@/domain/features/checkinbiz/IChecklog"
import { useLayout } from "@/hooks/useLayout"
import { useToast } from "@/hooks/useToast"
import { createLog, getEmplyeeLogs } from "@/services/checkinbiz/employee.service"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"



export const useCheck = () => {
    const t = useTranslations()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const [checkAction, setCheckAction] = useState<"checkout" | "checkin">('checkout')
    const [restAction, setRestAction] = useState<"restout" | "restin">('restout')
    const [openLogs, setOpenLogs] = useState(false)
    const [token, setToken] = useState('ds')
    const [pending, setPending] = useState(false)
    const [geo, setGeo] = useState<{ latitude: number, longitude: number }>({ latitude: 0, longitude: 0 })
    const [employeeLogs, setEmployeeLogs] = useState<Array<IChecklog>>([])
    const searchParams = useSearchParams()
    const tokenBase64 = searchParams.get('token') || null;

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

    const getEmplyeeLogsData = async () => {
        try {
            const data: Array<IChecklog> = await getEmplyeeLogs(sessionData?.entityId || '', sessionData?.employeeId || '', { limit: 50, orderBy: 'createdAt', orderDirection: 'desc' } as any) as Array<IChecklog>
            setEmployeeLogs(data)
        } catch (error) {
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    const createLogAction = (type: "checkout" | "checkin" | "restin" | "restout") => {
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
            getEmplyeeLogsData()
        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            changeLoaderState({ show: false })
        })
    }


    useEffect(() => {
        createLogAction(checkAction)
    }, [checkAction])

    useEffect(() => {
        createLogAction(restAction)
    }, [restAction])

    useEffect(() => {
        if (tokenBase64) {
            getCurrenGeo()
            getEmplyeeLogsData()
        }
    }, [tokenBase64])



    return { pending, checkAction, setCheckAction, restAction, setRestAction, setOpenLogs, openLogs, createLogAction, employeeLogs }
}

