/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Divider, Typography } from "@mui/material";
import { getTextByKey, useDashboard } from "../../context/dashboardContext";
import { CustomizableGroupedBarChart } from "../common/chart/GroupedBarChart";
import { useEffect, useState } from "react";





export const OperatingHours = () => {
    const itemInThisCats = ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour']
    // Colors for the bars
    const { cardIndicatorSelected, branchPatternList, preferenceItems } = useDashboard()
    const [chartData, setChartData] = useState<{
        branch: Array<{ key: string, name: string, color: string }>
        data: Array<any>
    }>({ branch: [], data: [] })
  
    const buildData = () => {

        const branchData: Array<{ key: string, name: string, color: string }> = []
        branchPatternList.forEach(element => {
            branchData.push(
                { key: element.branch.name.toLowerCase(), name: element.branch.name, color: element.color }
            )
        });
      
        const data: Array<any> = []
        cardIndicatorSelected.filter(e => itemInThisCats.includes(e)).forEach(indicator => {
            const items = { category: getTextByKey(indicator, preferenceItems) }
            branchPatternList.forEach(branchPattern => {
                let value = 0
                if (indicator === 'avgStartHour_avgEndHour')
                    value = branchPattern.normalized?.horarios?.weeklyHours ?? 0
                if (indicator === 'stdStartHour_stdEndHour')
                    value = branchPattern.normalized?.horarios?.stability ?? 0


                Object.assign(items, { [branchPattern.branch.name.toLowerCase()]: value })
            });
            data.push(items)
        });

        setChartData({
            branch: branchData,
            data
        })
    }

    useEffect(() => {
        buildData()
    }, [branchPatternList.length, cardIndicatorSelected.length])

 





    return <BorderBox sx={{ p: 4 }}>
        <Typography variant="h6">Horarios Operativos</Typography>
        <Typography variant="body1">
            Comparación del comportamiento horario entre sucursales/proyectos.  Los valores se normalizan en una escala 0–100,
            donde los más altos indican mayor estabilidad operativa, mejor organización del tiempo y un reparto de horas más consistente.
        </Typography>
        <Divider flexItem />

        <CustomizableGroupedBarChart
            data={chartData.data}
            
            height={350}
            entities={chartData.branch}
        />
    </BorderBox>
}