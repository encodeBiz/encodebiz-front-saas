import { Typography, Paper } from "@mui/material"
import { useTranslations } from "next-intl"

export const Attedance = ({ children }: {   children: React.ReactNode }) => {
    const t = useTranslations()

    return <Paper elevation={0} sx={{ p: 3 }}>
        
        {children}

    </Paper>

}