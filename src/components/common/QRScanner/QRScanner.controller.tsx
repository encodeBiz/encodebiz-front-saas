import { useLayout } from "@/hooks/useLayout"
import { useToast } from "@/hooks/useToast"
import { validateHolder } from "@/services/passinbiz/holder.service"
import { useTranslations } from "next-intl"
import { useState } from "react"
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



    const validateData = async (data: any) => {
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            const response = await validateHolder(data)                     
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


    return { handleScan, handleError, resetScanner, scanRessult, scanning, error }
}

