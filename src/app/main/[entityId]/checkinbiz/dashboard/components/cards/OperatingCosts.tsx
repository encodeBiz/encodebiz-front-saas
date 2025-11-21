/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getTextByKey, useDashboard } from "../../context/dashboardContext";
import { CustomizableGroupedBarChart } from "../common/chart/GroupedBarChart";

export const OperatingCosts = () => {

    const itemInThisCats = ['avgCostHour', 'avgCycleCost', 'avgCostEfficiency', 'effectiveRealCost']
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
                if (indicator === 'avgCostHour')
                    value = branchPattern.normalized?.costes?.costHour ?? 0
                if (indicator === 'avgCycleCost')
                    value = branchPattern.normalized?.costes?.costCycle ?? 0
                if (indicator === 'avgCostEfficiency')
                    value = branchPattern.normalized?.costes?.costEfficiency ?? 0
                if (indicator === 'effectiveRealCost')
                    value = branchPattern.normalized?.costes?.costEffective ?? 0


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
    }, [cardIndicatorSelected.length, branchPatternList.length])



    return <BorderBox sx={{ p: 4 }}>
        <Typography variant="h6">Costes Operativos</Typography>
        <Typography variant="body1">
            Comparación del rendimiento económico entre sucursales/proyectos.
            Los valores se normalizan en una escala 0–100, donde puntuaciones más altas representan un uso más eficiente de los recursos, menores desviaciones y un mejor equilibrio coste-productividad.        </Typography>

        <Divider flexItem />
        <CustomizableGroupedBarChart
            data={chartData.data}

            height={350}
            entities={chartData.branch}
        />
    </BorderBox>
}