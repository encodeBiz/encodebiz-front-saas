/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { Box, Divider, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { getTextByKey, useDashboard } from "../../context/dashboardContext"
import { CustomizableGroupedBarChart } from "../../../../../../../components/common/help/GroupedBarChart"
import { preferenceDashboardItems } from "@/domain/features/checkinbiz/IStats"
import { useTranslations } from "next-intl"


export const DataReliability = () => {
    const itemInThisCats = ['reliability', 'dataPoints']
        const t = useTranslations()
    
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
                { key: element.branch?.name.toLowerCase() as string, name: element.branch?.name as string, color: element.color }
            )
        });

        const chartData: Array<any> = []
        cardIndicatorSelected.filter(e => itemInThisCats.includes(e)).forEach(indicator => {
            const items = { category: getTextByKey(indicator, preferenceDashboardItems(t)) }
            branchPatternList.forEach(branchPattern => {
                let value = 0
                if (indicator === 'reliability')
                    value = branchPattern.normalized?.confiabilidad?.confidence ?? 0
                if (indicator === 'dataPoints')
                    value = branchPattern.normalized?.confiabilidad?.observations ?? 0

                Object.assign(items, { [branchPattern.branch?.name.toLowerCase() as string]: value })
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
    }, [branchPatternList.length, cardIndicatorSelected.length])



    return <BorderBox sx={{background:'#FFF'}} >
        <Box sx={{ p: 4 }}>
            <Typography variant="h6">{t('employeeDashboard.dataConfiability')}</Typography>
            <Typography variant="body1">
                {t('employeeDashboard.dataConfiabilityText')}
            </Typography>
        </Box>
        <Divider orientation="horizontal" flexItem />
        <Box sx={{ p: 4 }}>
            <CustomizableGroupedBarChart
                data={chartData.data}
                height={350}
                entities={chartData.branch}
            />
        </Box>
    </BorderBox>
}