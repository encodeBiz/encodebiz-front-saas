'use client'
import { useLayout } from "@/hooks/useLayout"
import { useToast } from "@/hooks/useToast"
import { validateHolder, validateStaff } from "@/services/passinbiz/holder.service"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
interface IQRResult {
    "holderId": string
    "companyName": string
    "entityId": string
    "productId": string
    entityType: string
    message?: string
    fullName?: string
}

export const useQRScanner = () => {
    const t = useTranslations()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const [scanning, setScanning] = useState<boolean>(false);
    const [scanRessult, setScanRessult] = useState<IQRResult | null>();
    const [error, setError] = useState<any>(null);
    const searchParams = useSearchParams()
    const tokenBase64 = searchParams.get('token') || null;
    const [tokenValidateStaff, setTokenValidateStaff] = useState('')
    const [staffValidating, setStaffValidating] = useState(true)
    const [staffValid, setStaffValid] = useState(false)


    const handleValidateStaff = useCallback(async () => {
        try {
            setStaffValidating(true)
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            const response: any = await validateStaff(tokenBase64 as string)
             setTokenValidateStaff(response.sessionToken)
            setError(null);
            changeLoaderState({ show: false })
            setStaffValidating(false)
            setStaffValid(true)
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
            setStaffValidating(false)
            setStaffValid(false)
        }
    }, [changeLoaderState, showToast, t, tokenBase64])


    const validateData = async (data: any) => {
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
             
            const response = await validateHolder(data, tokenValidateStaff)
            setScanRessult({
                ...data,
                ...response
            });
            setError(null);
            changeLoaderState({ show: false })
        } catch (error: any) {
            changeLoaderState({ show: false })
            setError(error.message);
            showToast(error.message, 'error')
        }
    }

    const handleScan = (data: any) => {
        if (data && data?.length > 0 && data[0].rawValue) {
            validateData(JSON.parse(data[0].rawValue))
        }
    };

    const handleError = (err: any) => {
        console.error('Scanner error:', err);
        setError(err);
        setScanning(false);
    };

    const resetScanner = () => {
        setScanRessult(null);
        setError(null);
        setScanning(false);
    };

    useEffect(() => {
        if (tokenBase64) handleValidateStaff()
    }, [handleValidateStaff, tokenBase64])



    return { handleScan, handleError, resetScanner, scanRessult, scanning, error, staffValidating, staffValid }
}

