/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useDashboard } from "../../context/dashboardContext";
import { CustomizableGroupedBarChart } from "../common/chart/GroupedBarChart";
import { clamp } from "@/lib/common/String";

export const OperatingCosts = () => {

    const itemInThisCats = ['avgCostHour', 'avgCycleCost', 'avgCostEfficiency', 'effectiveRealCost']
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
                if (indicator === 'avgCostHour')
                    value = clamp(branchPattern.pattern?.avgCostHour)
                if (indicator === 'avgCycleCost')
                    value = clamp(branchPattern.pattern?.avgCycleCost)
                if (indicator === 'avgCostEfficiency')
                    value = clamp(branchPattern.pattern?.avgCostEfficiency)
                if (indicator === 'effectiveRealCost')
                    value = clamp(branchPattern.pattern?.effectiveRealCost)


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



    return <BorderBox sx={{ p: 4 }}>
        <Typography variant="h6">Costes Operativos</Typography>
        <Typography variant="body1">
            Comparación del rendimiento económico entre sucursales/proyectos.
            Los valores se normalizan en una escala 0–100, donde puntuaciones más altas representan un uso más eficiente de los recursos, menores desviaciones y un mejor equilibrio coste-productividad.        </Typography>

        <CustomizableGroupedBarChart
            data={chartData.data}
            title="Quarterly Business Metrics"
            height={350}
            entities={chartData.branch}
        />
    </BorderBox>
}