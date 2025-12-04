
import { Typography, Paper, Box } from "@mui/material"
import { useTranslations } from "next-intl"
import ReplyThread from "./ReplyThread"

export const ResponseList = () => {
    const t = useTranslations()

    return <Paper elevation={0} sx={{ p: 3 }}>
        <Box display={'flex'} justifyContent={'space-between'} alignContent={'center'} mb={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                {t("issues.responses")}
            </Typography>
        </Box>
        <ReplyThread />
    </Paper>


}