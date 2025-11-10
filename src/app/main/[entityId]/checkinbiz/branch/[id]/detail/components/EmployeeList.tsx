import { Typography, Paper } from "@mui/material"
import { useTranslations } from "next-intl"

export const EmployeeList = ({ children }: {   children: React.ReactNode }) => {
    const t = useTranslations()

    return <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
            {t("employee.list")}
        </Typography>

        {children}

    </Paper>

}