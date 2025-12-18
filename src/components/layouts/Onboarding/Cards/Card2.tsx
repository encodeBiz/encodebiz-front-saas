import { Box, Typography, useTheme } from "@mui/material"
import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { HealthAndSafetyOutlined, PaletteOutlined, TextSnippetOutlined } from "@mui/icons-material"

import { useLayout } from "@/hooks/useLayout"
import { useCommonModal } from "@/hooks/useCommonModal"
import { CommonModalType } from "@/contexts/commonModalContext"
import { useTranslations } from "next-intl"
import { karla } from "@/config/fonts/google_fonts"

export const Card2 = ({ handleNext }: any) => {
    const theme = useTheme()
    const { navivateTo } = useLayout()
    const { closeModal } = useCommonModal()
    const t = useTranslations()
    return <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} p={2} >
        <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2} justifyContent={'space-between'} alignItems={'flex-start'} >
            <Typography marginTop={2} variant="h3">{t('cards.card2.text1')}</Typography>
            <Box display={'flex'} flexDirection={"column"} gap={2}>
                <Typography variant="body1">{t('cards.card2.text2')}</Typography>
                <Typography variant="body1">{t('cards.card2.text3')}</Typography>
            </Box>
            <Box display={'flex'} flexDirection={"row"} gap={5} marginTop={3}>
                <BorderBox sx={{ position: 'relative', minHeight:255 }}>
                    <PaletteOutlined sx={{ position: 'absolute', top: -20, left: -20, color: '#FFF', background: (theme) => theme.palette.primary.main, p: 1, fontSize: 40, borderRadius: '50%' }} />
                    <Box sx={{ p: 4, fontFamily: karla.style.fontFamily }}>
                        <span style={{ color: theme.palette.primary.main, fontSize: 22 }}> {t('cards.card2.text4')}</span>
                         <br />
                         {t('cards.card2.text5')}
                    </Box>

                </BorderBox>
                <BorderBox sx={{ position: 'relative', fontFamily: karla.style.fontFamily, minHeight:255 }}>
                    <TextSnippetOutlined sx={{ position: 'absolute', top: -20, left: -20, color: '#FFF', background: (theme) => theme.palette.primary.main, p: 1, fontSize: 40, borderRadius: '50%' }} />

                    <Box sx={{ p: 4 }}>
                        <span style={{ color: theme.palette.primary.main, fontSize: 22 }}>{t('cards.card2.text6')}</span>
                        <br />
                        {t('cards.card2.text7')}

                    </Box>
                </BorderBox>
                <BorderBox sx={{ position: 'relative', fontFamily: karla.style.fontFamily, minHeight:255  }}>
                    <HealthAndSafetyOutlined sx={{ position: 'absolute', top: -20, left: -20, color: '#FFF', background: (theme) => theme.palette.primary.main, p: 1, fontSize: 40, borderRadius: '50%' }} />

                    <Box sx={{ p: 4 }}>
                        <span style={{ color: theme.palette.primary.main, fontSize: 22 }}> {t('cards.card2.text8')}</span>
                          <br />
                         {t('cards.card2.text9')}
                    </Box>
                </BorderBox>
            </Box>
        </Box>
        <Box marginTop={10} display={'flex'} flexDirection={"row"} justifyContent={'flex-end'} alignItems={'flex-end'} gap={4}>
            <SassButton sx={{ width: '437px' }} size="small" onClick={() => {
                navivateTo(`/entity?tab=company`)
                closeModal(CommonModalType.ONBOARDING)
            }} variant="contained" color="primary">{t('cards.card3.text14')}</SassButton>
            <SassButton sx={{ background: '#EBEEFB' }} size="small" onClick={handleNext} variant="outlined" color="primary">{t('cards.card2.continue')}</SassButton>
        </Box>

    </Box>
}
