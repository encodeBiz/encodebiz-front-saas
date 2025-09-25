/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ICreateLog } from "@/domain/features/checkinbiz/IChecklog"
import { useLayout } from "@/hooks/useLayout"
import { useToast } from "@/hooks/useToast"
import { createLog } from "@/services/checkinbiz/employee.service"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"



export const useCheck = () => {
    const t = useTranslations()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const [startJornada, setStartJornada] = useState(false)
    const [startDescanso, setStartDescanso] = useState(false)
    const [disabledJornada, setDisabledJornada] = useState(false)
    const [openLogs, setOpenLogs] = useState(false)
    const [token, setToken] = useState('ds')
    const [pending, setPending] = useState(false)
 
    const createLogAction = (type: "checkout" | "checkin" | "restin" | "restout") => {
        const data: ICreateLog = {
            "employeeId": '',
            "entityId": '',
            "branchId": '',
            type,
            "geo": {
                "lat": 0,
                "lng": 0
            }
        }
        setPending(true);
        changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
        createLog(data, token).then(res => {
            console.log(res);
            

        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            changeLoaderState({ show: false })
        })
    }

    useEffect(() => {
        createLogAction(startJornada ? 'checkin' : 'checkout')
    }, [startJornada])

    useEffect(() => {
        createLogAction(startDescanso ? 'restin' : 'restout')
    }, [startDescanso])




    return { pending, startJornada, setStartJornada, startDescanso, setStartDescanso, disabledJornada, setOpenLogs, openLogs, createLogAction }
}

