import { Box, Typography } from "@mui/material"
import Image from "next/image"
import image from '../../../../../public/assets/images/onboarding1.png'
import { SassButton } from "@/components/common/buttons/GenericButton"
import { useTranslations } from "next-intl"

export const Card1 = ({handleNext}: any) => {
    const t = useTranslations()

    return <Box display={'flex'} flexDirection={"row"} p={2}  >
    
    <Box width={'55%'} display={'flex'} flexDirection={"column"} gap={8} justifyContent={'space-between'} alignItems={'flex-start'} >
        
        <Typography variant="h3">{t('cards.card1.text1')}</Typography>
        <Box  display={'flex'} flexDirection={"column"} gap={2}>
            <Typography variant="h6">{t('cards.card1.text2')}</Typography>
            <Typography variant="body1">{t('cards.card1.text3')}</Typography>
        </Box>
        <SassButton sx={{width:'420px', background:'#EBEEFB'}} size="small" onClick={handleNext} variant="outlined" color="primary">{t('cards.card1.start')}</SassButton>
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

}