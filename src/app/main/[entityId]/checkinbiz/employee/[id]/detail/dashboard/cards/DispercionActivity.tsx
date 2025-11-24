import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import InfoModal from "@/components/common/modals/InfoModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { InfoOutline } from "@mui/icons-material";
import { useDashboardEmployee } from "../DashboardEmployeeContext";
import { InfoHelp } from "../../../../../../../../../components/common/help/InfoHelp";
import { tempActivityData } from "../../../../../../../../../components/common/help/constants";
import { useTranslations } from "next-intl";
import Chart from "@/app/main/[entityId]/checkinbiz/dashboard/components/common/chart/Chart";






export const DispercionActivity = () => {
    const { type, branchPatternList } = useDashboardEmployee()

    const description: any = {
        "weeklyStartAvg": "Variación diaria de la hora promedio de inicio de la jornada.",
        "weeklyEndAvg": "Variación diaria de la hora promedio de fin de la jornada.",
        "weeklyWorkAvg": "Evolución diaria del total promedio de horas trabajadas.",
    }
    const { open, openModal, closeModal } = useCommonModal()
    const t = useTranslations()


    return <BorderBox>
        <Box sx={{ p: 4 }}>

            <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                   Dispersión semanal de entrada y salida
                </Typography  >
            </Box>
            <Typography variant="body1">
                Comparativa semanal de dispersión, muestra el nivel de variabilidad real en los horarios de entrada y salida del empleado a lo largo de la semana.
            </Typography>
        </Box>
        <Divider orientation="horizontal" flexItem />
        <Box sx={{ p: 4 }}>
            <Chart type={type} branchPatternList={branchPatternList} />
        </Box>

        {open.type === CommonModalType.INFO && open.args?.id === 'data2' && <InfoModal
            centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
            htmlDescription={<InfoHelp title="Ayuda" data={tempActivityData(t)} />}
            onClose={() => closeModal(CommonModalType.INFO)}
        />}
    </BorderBox>
}