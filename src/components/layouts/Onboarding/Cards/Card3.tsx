import { Badge, Box, Typography, useTheme } from "@mui/material"
import Image from "next/image"
import logo from '../../../../../public/assets/images/logo.png'
import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { HealthAndSafetyOutlined, PaletteOutlined, TextSnippetOutlined } from "@mui/icons-material"
import { useRouter } from "nextjs-toploader/app"
import { GENERAL_ROUTE, MAIN_ROUTE } from "@/config/routes"

export const Card3 = ({ handleNext }: any) => {
    const theme = useTheme()
    const { push } = useRouter()
    return <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} p={2} height={631}>
        <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2} justifyContent={'space-between'} alignItems={'flex-start'} >
            <Image
                width={220}
                height={73}
                alt=""
                src={logo}
            />
            <Typography marginTop={10} variant="h3">Hoy con encodeBiz SaaS</Typography>
            <Box display={'flex'} flexDirection={"column"} gap={2}>
                <Typography variant="body1">Tu primer servicio,</Typography>
            </Box>
            <Box display={'flex'} flexDirection={"row"} gap={5} marginTop={3}>
                <Box display={'flex'} flexDirection={"row"} gap={5} marginTop={3}>

                </Box>
                <Box display={'flex'} flexDirection={"row"} gap={5} marginTop={3}>

                </Box>
            </Box>
        </Box>

    </Box>
}
