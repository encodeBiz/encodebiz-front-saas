import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Typography } from "@mui/material";
import { useDashboard } from "../../context/dashboardContext";
import Chart from "../common/Chart";





export const TempActivity = () => {
    const { type } = useDashboard()
    const description: any = {
        "weeklyStartAvg": "Variación diaria de la hora promedio de inicio de la jornada.",
        "weeklyEndAvg": "Variación diaria de la hora promedio de fin de la jornada.",
        "weeklyWorkAvg": "Evolución diaria del total promedio de horas trabajadas.",
    }



    return <BorderBox sx={{ p: 4 }}>
        <Typography variant="h6">Actividad temporal</Typography>
        <Typography variant="body1">
            {description[type]}
        </Typography>

        <Chart />
    </BorderBox>
}