import { Box, Typography } from "@mui/material"
import Image from "next/image"
import logo from '../../../../../public/assets/images/logo.png'
import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"

export const Card2 = ({ handleNext }: any) => <Box display={'flex'} flexDirection={"column"} p={2} height={631}>
    <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2} justifyContent={'space-between'} alignItems={'flex-start'} >
        <Image
            width={220}
            height={73}
            alt=""
            src={logo}
        />
        <Typography variant="h3">Primero, configura tu entidad</Typography>
        <Box display={'flex'} flexDirection={"column"} gap={2}>
            <Typography variant="body1">Antes de elegir un servicio y plan te recomendamos completar la configuración de tu entidad.</Typography>
            <Typography variant="body1">Esto nos permite,</Typography>
        </Box>
        <Box display={'flex'} flexDirection={"row"} gap={2}>
            <BorderBox sx={{p:4}}>
                Personalizar la experiencia con la identidad corporativa de tu organización en cualquier servicio.
            </BorderBox>
            <BorderBox sx={{p:4}}>
                Personalizar la experiencia con la identidad corporativa de tu organización en cualquier servicio.
            </BorderBox>
            <BorderBox sx={{p:4}}>
                Asegurar un uso legítimo y transparente de los servicios, cumpliendo con los requisitos legales y de protección 
            </BorderBox>

        </Box>
        <SassButton sx={{ width: '420' }} size="small" onClick={handleNext} variant="outlined" color="primary">Comenzar</SassButton>
    </Box>

</Box>
