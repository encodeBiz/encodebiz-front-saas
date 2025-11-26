/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Box, Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getTextByKey, useDashboard } from "../../context/dashboardContext";
import { CustomizableGroupedBarChart } from "../../../../../../../components/common/help/GroupedBarChart";
import { useTranslations } from "next-intl";
import { preferenceDashboardItems } from "@/domain/features/checkinbiz/IStats";

export const OperatingCosts = () => {
    const t = useTranslations()

    const itemInThisCats = ['avgCostHour', 'avgCycleCost', 'avgCostEfficiency', 'effectiveRealCost']
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
        const data: Array<any> = []
        cardIndicatorSelected.filter(e => itemInThisCats.includes(e)).forEach(indicator => {
            const items = { category: getTextByKey(indicator, preferenceDashboardItems(t)) }
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


                Object.assign(items, { [branchPattern.branch?.name?.toLowerCase() as string]: value })
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



    return <BorderBox sx={{ background: '#FFF' }} >
        <Box sx={{ p: 4 }}>
            <Typography variant="h6">{t('employeeDashboard.costs')}</Typography>
            <Typography variant="body1">
                {t('employeeDashboard.costsText1')}
                {t('employeeDashboard.costsText2')}
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