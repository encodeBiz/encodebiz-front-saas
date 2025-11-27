/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Box, Divider, Typography } from "@mui/material";
import { useDashboardEmployee } from "../DashboardEmployeeContext";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { type } from "os";
import ChartLine from "@/components/common/help/ChartLine";

export const DispercionActivity = () => {
    const { employeePatternList } = useDashboardEmployee()
    const t = useTranslations()

    const [chartData, setChartData] = useState<Array<Record<string, number>>>([])
    const updateChartData = async () => {
        const chartDataList: Array<Record<string, number>> = Array(7).fill(0)
        if (employeePatternList.length > 0) {
            chartDataList.forEach((_, i) => {
                const item = {}
                const employeePattern = employeePatternList[0]
                const valueStart = parseFloat(`${((employeePattern).pattern.stdStartByDay[i]?.std ?? 0).toFixed(2)}`)
                const valueEnd = parseFloat(`${((employeePattern).pattern.stdEndByDay[i]?.std ?? 0).toFixed(2)}`)

                Object.assign(item, {
                    ['Entrada']: valueStart,
                    ['Salida']: valueEnd
                })

                    chartDataList.splice(i,1,item)
            });
        }
        setChartData(chartDataList)
    }
    useEffect(() => {
        updateChartData()
    }, [employeePatternList.length, type])


    return <BorderBox sx={{ background: '#FFF' }} >
        <Box sx={{ p: 4 }}>

            <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                        {t('employeeDashboard.dispertionTitle')}
                </Typography  >
            </Box>
            <Typography variant="body1">
                {t('employeeDashboard.dispertionText')}
            </Typography>
        </Box>
        <Divider orientation="horizontal" flexItem />
        <Box sx={{ p: 4 }}>
            <ChartLine data={chartData} />
        </Box>

    </BorderBox>
}