
import { Typography, Paper, Box } from "@mui/material"
import { useTranslations } from "next-intl"

export const ResponseList = ({ children }: { children: React.ReactNode }) => {
    const t = useTranslations()

    return <Paper elevation={0} sx={{ p: 3 }}>
        <Box display={'flex'} justifyContent={'space-between'} alignContent={'center'} mb={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                {t("employee.list")}
            </Typography>
        </Box>
        {children}
    </Paper>


}