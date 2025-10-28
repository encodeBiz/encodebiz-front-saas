import { Typography, Paper } from "@mui/material"
import { useTranslations } from "next-intl"

export const Attedance = ({ children }: {   children: React.ReactNode }) => {
    const t = useTranslations()

    return <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
            {t("checklog.list")}
        </Typography>

        {children}

    </Paper>

}