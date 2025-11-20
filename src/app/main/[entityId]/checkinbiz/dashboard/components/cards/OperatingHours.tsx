/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Typography } from "@mui/material";
import { useDashboard } from "../../context/dashboardContext";
import { CustomizableGroupedBarChart } from "../common/chart/GroupedBarChart";
import { useEffect, useState } from "react";
import { clamp } from "@/lib/common/String";





export const OperatingHours = () => {
    const itemInThisCats = ['avgStartHour_avgEndHour', 'stdStartHour_stdEndHour']
    // Colors for the bars
    const { cardIndicatorSelected, branchPatternList } = useDashboard()
    const [chartData, setChartData] = useState<{
        branch: Array<{ key: string, name: string, color: string }>
        data: Array<any>
    }>({ branch: [], data: [] })
    const buildBranch = () => {
     
        const branchData: Array<{ key: string, name: string, color: string }> = []
        branchPatternList.forEach(element => {
            branchData.push(
                { key: element.branch.name.toLowerCase(), name: element.branch.name, color: element.color }
            )
        });
        setChartData({
            ...chartData,
            branch: branchData
        })
    }
    const buildData = () => {
 
        const data: Array<any> = []
        cardIndicatorSelected.filter(e => itemInThisCats.includes(e)).forEach(indicator => {
            const items = { category: indicator }
            branchPatternList.forEach(branchPattern => {
                let value = 0
                if (indicator === 'avgStartHour_avgEndHour')
                    value = clamp(branchPattern.pattern?.avgEndHour - branchPattern.pattern?.avgStartHour)
                if (indicator === 'stdStartHour_stdEndHour')
                    value = clamp(branchPattern.pattern?.stdEndHour - branchPattern.pattern?.stdStartHour)


                Object.assign(items, { [branchPattern.branch.name.toLowerCase()]: value })
            });
            data.push(items)
        });

        setChartData({
            ...chartData,
            data
        })
    }

    useEffect(() => {
        buildBranch()
    }, [branchPatternList.length])

    useEffect(() => {
        buildData()
    }, [cardIndicatorSelected.length])

     useEffect(() => {
        console.log('OperatingHours');        
    }, [])



    return <BorderBox sx={{ p: 4 }}>
        <Typography variant="h6">Horarios Operativos</Typography>
        <Typography variant="body1">
            Comparación del comportamiento horario entre sucursales/proyectos.  Los valores se normalizan en una escala 0–100,
            donde los más altos indican mayor estabilidad operativa, mejor organización del tiempo y un reparto de horas más consistente.
        </Typography>
 
        <CustomizableGroupedBarChart
            data={chartData.data}
            title="Quarterly Business Metrics"
            height={350}
            entities={chartData.branch}
        />
    </BorderBox>
}