/* eslint-disable react-hooks/exhaustive-deps */
import { BorderBox } from "@/components/common/tabs/BorderBox";
import { Box, Divider, IconButton, Typography } from "@mui/material";

import { useTranslations } from "next-intl";
import { useCommonModal } from "@/hooks/useCommonModal";
import { CommonModalType } from "@/contexts/commonModalContext";
import { InfoOutline } from "@mui/icons-material";
import InfoModal from "@/components/common/modals/InfoModal";
import { useDashboardEmployee } from "../DashboardEmployeeContext";
import { InfoHelp } from "../../../../../../../../../components/common/help/InfoHelp";
import { operationDataEmployee } from "../../../../../../../../../components/common/help/constants";
import { CardIndicatorData, indicatorList } from "@/components/common/help/CardIndicatorData";






export const OperatingHours = () => {
    const t = useTranslations()
    const { open, openModal, closeModal } = useCommonModal()


    // Colors for the bars
    const { cardIndicatorSelected, employeePatternList } = useDashboardEmployee()


    return <BorderBox sx={{ background: '#FFF' }} >
        <Box sx={{ p: 4 }}>

            <Box display={'flex'} gap={0.2} justifyItems={'center'} alignItems={'center'}>
                <Typography align="center" sx={{ mb: 0, textAlign: 'left', fontSize: 32 }}>
                    Datos Operativos
                </Typography>
                <IconButton onClick={() => openModal(CommonModalType.INFO, { id: 'data1' })}><InfoOutline sx={{ fontSize: 25 }} /></IconButton>
            </Box>
            <Typography variant="body1">
                Datos que muestran cómo trabaja el empleado en términos de horarios, carga de trabajo y coherencia de sus registros.
                Ayudan a entender su estabilidad operativa, el uso real de su tiempo y la fiabilidad de la información registrada en sus jornadas.
            </Typography>
        </Box>

        <Divider orientation="horizontal" flexItem />
        <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-around'} gap={2} p={3}>
            {indicatorList(t).filter(e => e.tag.includes('employee')).filter(e => cardIndicatorSelected.includes(e.id)).map((e, i) =>
                <CardIndicatorData key={i} value={e.data(employeePatternList[0] as any)} icon={e.icon} label={e.label} />
            )}
        </Box>

        {open.type === CommonModalType.INFO && open.args?.id === 'data1' && <InfoModal
            centerBtn cancelBtn={false} closeBtn={false} closeIcon={false}
            htmlDescription={<InfoHelp title="Ayuda" data={operationDataEmployee(t)} />}
            onClose={() => closeModal(CommonModalType.INFO)}
        />}
    </BorderBox>
}


