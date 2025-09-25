/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useLayout } from "@/hooks/useLayout"
import { useToast } from "@/hooks/useToast"
import { useTranslations } from "next-intl"
import { useState } from "react"
 
 

export const useCheck = () => {
    const t = useTranslations()
    const { changeLoaderState } = useLayout()
    const { showToast } = useToast()
    const [startJornada, setStartJornada] = useState(false)
    const [startDescanso, setStartDescanso] = useState(false)
    const [disabledJornada, setDisabledJornada] = useState(false)
    const [openLogs, setOpenLogs] = useState(false) 
    


    return { startJornada, setStartJornada, startDescanso, setStartDescanso, disabledJornada, setOpenLogs, openLogs}
}

