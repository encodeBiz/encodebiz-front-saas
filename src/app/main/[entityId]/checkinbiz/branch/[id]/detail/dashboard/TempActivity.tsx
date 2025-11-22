import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { useDashboard } from "../../../../dashboard/context/dashboardContext";
import Chart from "./Chart";
import InfoModal from "@/components/common/modals/InfoModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { InfoOutline } from "@mui/icons-material";
import { PanelModalInfo } from "./PanelModalInfo";






export const TempActivity = () => {
    const { type } = useDashboard()
    const description: any = {
        "weeklyStartAvg": "Variación diaria de la hora promedio de inicio de la jornada.",
        "weeklyEndAvg": "Variación diaria de la hora promedio de fin de la jornada.",
        "weeklyWorkAvg": "Evolución diaria del total promedio de horas trabajadas.",
    }
    const { open, openModal, closeModal } = useCommonModal()



    return <BorderBox>
        <Box sx={{ p: 4 }}>

            <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                    Actividad temporal                    
                </Typography  >
                <IconButton onClick={() => openModal(CommonModalType.INFO, { id: 'data3' })}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
            </Box>
            <Typography variant="body1">
                {description[type]}
            </Typography>
        </Box>
        <Divider orientation="horizontal" flexItem />
        <Box sx={{ p: 4 }}>
            <Chart />
        </Box>

        {open.type === CommonModalType.INFO && open.args?.id === 'data3' && <InfoModal
            centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
            htmlDescription={<PanelModalInfo />}
            onClose={() => closeModal(CommonModalType.INFO)}
        />}
    </BorderBox>
}