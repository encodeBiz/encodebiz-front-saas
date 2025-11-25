/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import InfoModal from "@/components/common/modals/InfoModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { InfoOutline } from "@mui/icons-material";
import { useDashboardEmployee } from "../DashboardEmployeeContext";
import { InfoHelp } from "../../../../../../../../../components/common/help/InfoHelp";
import { descriptionTypeActivity, tempActivityData } from "../../../../../../../../../components/common/help/constants";
import { useTranslations } from "next-intl";
import Chart from "@/app/main/[entityId]/checkinbiz/panel/components/common/chart/ChartActivity";
import { useEffect, useState } from "react";
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee";
import { IEmployeePattern } from "@/domain/features/checkinbiz/IStats";
import ChartActivity from "@/app/main/[entityId]/checkinbiz/panel/components/common/chart/ChartActivity";
import ChartLine from "@/components/common/help/ChartLine";






export const TempActivity = () => {
    const { type, employeePatternList } = useDashboardEmployee()
 
    const { open, openModal, closeModal } = useCommonModal()
    const t = useTranslations()

     const [chartData, setChartData] = useState<Array<Record<string, number>>>([])
        const updateChartData = async () => {
            const chartDataList: Array<Record<string, number>> = Array(7).fill(0)
            if (employeePatternList.length > 0) {
                chartDataList.forEach((_, i) => {
                    const item = {}
                    employeePatternList.forEach((patternEmployee: {pattern: IEmployeePattern,employeeId: string, employee: IEmployee}) => {
                        const value = parseFloat(`${((patternEmployee as any).pattern[type][i] ?? 0).toFixed(2)}`)
                        Object.assign(item, {
                            [patternEmployee.employee?.fullName as string]: value
                        })
                    });
                    chartDataList.splice(i,1,item)
                });                
            }
         
            setChartData(chartDataList)
        }
        useEffect(() => {
            updateChartData()
        }, [employeePatternList.length, type])


    return <BorderBox sx={{background:'#FFF'}} >
        <Box sx={{ p: 4 }}>

            <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                    Actividad temporal
                </Typography  >
                <IconButton onClick={() => openModal(CommonModalType.INFO, { id: 'data2' })}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
            </Box>
            <Typography variant="body1">
                {descriptionTypeActivity(t)[type]}              
            </Typography>
        </Box>
        <Divider orientation="horizontal" flexItem />
        <Box sx={{ p: 4 }}>
            <ChartLine data={chartData} />
        </Box>

        {open.type === CommonModalType.INFO && open.args?.id === 'data2' && <InfoModal
            centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
            htmlDescription={<InfoHelp title="Ayuda" data={tempActivityData(t)} />}
            onClose={() => closeModal(CommonModalType.INFO)}
        />}
    </BorderBox>
}