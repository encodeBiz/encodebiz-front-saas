/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { useDashboard } from "../../context/dashboardContext"
import { CustomizableGroupedBarChart } from "../common/chart/GroupedBarChart"
import { clamp } from "@/lib/common/String"


export const DataReliability = () => {
    const itemInThisCats = ['reliability', 'dataPoints']
    // Colors for the bars
    const { cardIndicatorSelected, branchPatternList } = useDashboard()
    const [chartData, setChartData] = useState<{
        branch: Array<{ key: string, name: string, color: string }>
        data: Array<any>
    }>({ branch: [], data: [] })
    const buildData = () => {
        const branchData: Array<{ key: string, name: string, color: string }> = []
        branchPatternList.forEach(element => {
            branchData.push(
                { key: element.branch.name, name: element.branch.name, color: element.color }
            )
        });

        const chartData: Array<any> = []
        cardIndicatorSelected.filter(e => itemInThisCats.includes(e)).forEach(indicator => {
            const items = { category: indicator }
            branchPatternList.forEach(branchPattern => {
                let value = 0
                if (indicator === 'reliability')
                    value = clamp(branchPattern.pattern?.reliability)
                if (indicator === 'dataPoints')
                    value = clamp(branchPattern.pattern?.dataPoints)


                Object.assign(items, { [indicator]: value })
            });
            chartData.push(items)
        });

        setChartData({
            branch: branchData,
            data: chartData
        })


    }

    useEffect(() => {
        buildData()
    }, [branchPatternList.length])



    return <BorderBox sx={{p:4}}>
        <Typography variant="h6">Confiabilidad del Dato</Typography>
        <Typography variant="body1">
            Comparación de la calidad y estabilidad del dato operativo entre sucursales/proyectos.  Los valores se normalizan en una escala 0–100, donde los más altos indican mayor consistencia, menor variabilidad y datos más fiables para la toma de decisiones.
        </Typography>

        <CustomizableGroupedBarChart
            data={chartData.data}
            title="Quarterly Business Metrics"
            height={350}
            entities={chartData.branch}
        />
    </BorderBox>
}