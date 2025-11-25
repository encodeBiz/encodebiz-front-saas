import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Box, Divider, Typography } from "@mui/material";
import { useDashboard } from "../../context/dashboardContext";
import ChartActivity from "../common/chart/ChartActivity";
import { descriptionTypeActivity } from "@/components/common/help/constants";
import { useTranslations } from "next-intl";





export const TempActivity = () => {
    const { type, branchPatternList } = useDashboard()
    const t = useTranslations()

    return <BorderBox sx={{ background: '#FFF' }} >
        <Box sx={{ p: 4 }}>
            <Typography variant="h6">Actividad temporal</Typography>
            <Typography variant="body1">
                {descriptionTypeActivity(t)[type]}
            </Typography>
        </Box>
        <Divider orientation="horizontal" flexItem />
        <Box sx={{ p: 4 }}>
            <ChartActivity type={type} branchPatternList={branchPatternList} />
        </Box>
    </BorderBox>
}