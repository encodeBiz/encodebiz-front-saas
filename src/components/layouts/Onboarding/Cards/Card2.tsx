import { Box, Typography, useTheme } from "@mui/material"
import Image from "next/image"
import logo from '../../../../../public/assets/images/logo.svg'
import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { HealthAndSafetyOutlined, PaletteOutlined,  TextSnippetOutlined } from "@mui/icons-material"
 
import { useLayout } from "@/hooks/useLayout"
import { useCommonModal } from "@/hooks/useCommonModal"
import { CommonModalType } from "@/contexts/commonModalContext"

export const Card2 = ({ handleNext }: any) => {
    const theme = useTheme()
    const { navivateTo } = useLayout()
    const { closeModal } = useCommonModal()
    return <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} p={2} >
        <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={8} justifyContent={'space-between'} alignItems={'flex-start'} >
            <Image
                width={220}
                height={73}
                alt=""
                src={logo}
            />
            <Typography marginTop={10} variant="h3">Primero, configura tu entidad</Typography>
            <Box display={'flex'} flexDirection={"column"} gap={2}>
                <Typography variant="body1">Antes de elegir un servicio y plan te recomendamos completar la configuración de tu entidad.</Typography>
                <Typography variant="body1">Esto nos permite,</Typography>
            </Box>
            <Box display={'flex'} flexDirection={"row"} gap={5} marginTop={3}>
                <Box sx={{ position: 'relative' }}>
                    <PaletteOutlined sx={{ position: 'absolute', top: -20, left: -20, color: '#FFF', background: (theme) => theme.palette.primary.main, p: 1, fontSize: 40, borderRadius: '50%' }} />
                    <BorderBox sx={{ p: 4 }}>
                        <span style={{ color: theme.palette.primary.main }}> Personalizar la experiencia</span> con la identidad corporativa de tu organización en cualquier servicio.
                    </BorderBox>

                </Box>
                <Box sx={{ position: 'relative' }}>
                    <TextSnippetOutlined sx={{ position: 'absolute', top: -20, left: -20, color: '#FFF', background: (theme) => theme.palette.primary.main, p: 1, fontSize: 40, borderRadius: '50%' }} />

                    <BorderBox sx={{ p: 4 }}>
                        <span style={{ color: theme.palette.primary.main }}>Personalizar la experiencia</span> con la identidad corporativa de tu organización en cualquier servicio.
                    </BorderBox>
                </Box>
                <Box sx={{ position: 'relative' }}>
                    <HealthAndSafetyOutlined sx={{ position: 'absolute', top: -20, left: -20, color: '#FFF', background: (theme) => theme.palette.primary.main, p: 1, fontSize: 40, borderRadius: '50%' }} />

                    <BorderBox sx={{ p: 4 }}>
                        <span style={{ color: theme.palette.primary.main }}> Asegurar un uso legítimo y transparente</span> de los servicios, cumpliendo con los requisitos legales y de protección
                    </BorderBox>
                </Box>
            </Box>
        </Box>
        <Box marginTop={10}  display={'flex'} flexDirection={"row"} justifyContent={'flex-end'} alignItems={'flex-end'} gap={4}>
            <SassButton sx={{ width: '420' }} size="small" onClick={() => {
                navivateTo(`/entity?tab=company`)
                closeModal(CommonModalType.ONBOARDING)
            }} variant="contained" color="primary">Ir a Configurar Entidad</SassButton>
            <SassButton sx={{ width: '420' }} size="small" onClick={handleNext} variant="outlined" color="primary">Continuar</SassButton>
        </Box>

    </Box>
}
