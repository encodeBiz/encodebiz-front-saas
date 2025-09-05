import { Box, Typography } from "@mui/material"
import Image from "next/image"
import image from '../../../../../public/assets/images/onboarding1.png'
import logo from '../../../../../public/assets/images/logo.png'
import { SassButton } from "@/components/common/buttons/GenericButton"

export const Card1 = ({handleNext}: any) => <Box display={'flex'} flexDirection={"row"} p={2}  >
    <Box width={'55%'} display={'flex'} flexDirection={"column"} gap={10} justifyContent={'space-between'} alignItems={'flex-start'} >
        <Image
            width={220}
            height={73}
            alt=""
            src={logo}
        />
        <Typography variant="h3">Bienvenido a encodeBiz SaaS</Typography>
        <Box  display={'flex'} flexDirection={"column"} gap={2}>
            <Typography variant="h6">Una plataforma creada para centralizar todos tus servicios digitales en un único lugar.</Typography>
            <Typography variant="body1">En encodeBiz convertimos tus ideas en soluciones digitales. Cuando nuestros servicios no cubren todas tus necesidades, creamos a tu medida lo que tu negocio requiere.</Typography>
        </Box>
        <SassButton sx={{width:'420'}} size="small" onClick={handleNext} variant="outlined" color="primary">Comenzar</SassButton>
    </Box>
    <Box width={'45%'} display={'flex'} alignItems={'center'} justifyContent={'center'} padding={0}>
        <Image
            width={400}
            height={620}
            alt=""
            src={image}
        />
    </Box>
</Box>
