import { Box, Typography } from "@mui/material"
import Image from "next/image"
import logo from '../../../../../public/assets/images/logo.svg'
import { SassButton } from "@/components/common/buttons/GenericButton"
import { useLayout } from "@/hooks/useLayout"
import { useCommonModal } from "@/hooks/useCommonModal"
import { CommonModalType } from "@/contexts/commonModalContext"
import icono from '../../../../../public/assets/images/bgCard.svg'
import { useTranslations } from "next-intl"
import { karla } from "@/config/fonts/google_fonts"

export const Card3 = ({ handleNext }: any) => {
    const { navivateTo } = useLayout()
    const t = useTranslations()
    const { closeModal } = useCommonModal()
    return <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} p={2}  >
        <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={1} justifyContent={'space-between'} alignItems={'flex-start'} >
            <Image
                width={220}
                height={73}
                alt=""
                src={logo}
            />
            <Typography marginTop={2} variant="h3">{t('cards.card3.text1')}</Typography>

            <br />
            <Box display={'flex'} flexDirection={"row"} gap={5}  >
                <Box borderRadius={2} width={'100%'} display={'flex'} flexDirection={"column"} gap={2} sx={{ background: (theme) => theme.palette.primary.light }}>
                    <Box position={'relative'} overflow={'hidden'} borderRadius={'10px 10px 0px 0px'} p={4} display={'flex'} flexDirection={"row"} alignItems={'flex-start'} gap={2} sx={{ background: (theme) => theme.palette.primary.dark, color: "#FFF" }}>
                        <Image
                            style={{ position: 'absolute', right: 0, top: -180 }}
                            width={500}
                            height={565}
                            alt=""
                            src={icono}
                        />
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
                                <Box>
                                    <svg width="66" height="70" viewBox="0 0 66 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M37.0578 17.763H57.0277C58.263 17.763 59.0865 18.5909 59.0865 19.8328V40.3238C55.7925 41.3587 53.322 44.0494 53.322 47.3611C53.322 50.6728 55.7925 53.3636 59.0865 54.3985V60.4009C59.0865 61.6428 58.263 62.4707 57.0277 62.4707H9.05875C7.8235 62.4707 7 61.6428 7 60.4009V54.6054C10.294 53.5705 12.7645 50.8798 12.7645 47.5681C12.7645 44.2564 10.294 41.5657 7 40.5308V20.0398C7 18.7979 7.8235 17.9699 9.05875 17.9699H29.0287M30.8815 7H34.9991C36.2343 7 37.0578 7.82792 37.0578 9.0698V19.4188C37.0578 20.6607 36.2343 21.4886 34.9991 21.4886H30.8815C29.6463 21.4886 28.8228 20.6607 28.8228 19.4188V9.0698C28.8228 7.82792 29.6463 7 30.8815 7Z" stroke="#FFFBFF" stroke-width="6" />
                                        <path d="M21.6178 49.2238C23.0959 49.2238 24.2942 48.0191 24.2942 46.533C24.2942 45.047 23.0959 43.8423 21.6178 43.8423C20.1397 43.8423 18.9414 45.047 18.9414 46.533C18.9414 48.0191 20.1397 49.2238 21.6178 49.2238Z" fill="#FFFBFF" />
                                        <path d="M33.3522 49.2238C34.8303 49.2238 36.0285 48.0191 36.0285 46.533C36.0285 45.047 34.8303 43.8423 33.3522 43.8423C31.874 43.8423 30.6758 45.047 30.6758 46.533C30.6758 48.0191 31.874 49.2238 33.3522 49.2238Z" fill="#FFFBFF" />
                                        <path d="M44.2643 49.2238C45.7424 49.2238 46.9407 48.0191 46.9407 46.533C46.9407 45.047 45.7424 43.8423 44.2643 43.8423C42.7861 43.8423 41.5879 45.047 41.5879 46.533C41.5879 48.0191 42.7861 49.2238 44.2643 49.2238Z" fill="#FFFBFF" />
                                        <path d="M16.265 26.6631H50.8521C51.8814 26.6631 52.7049 27.491 52.7049 28.5259C52.7049 29.5608 51.8814 30.3887 50.8521 30.3887H16.265C15.2356 30.3887 14.4121 29.5608 14.4121 28.5259C14.4121 27.491 15.2356 26.6631 16.265 26.6631Z" fill="#FFFBFF" />
                                        <path d="M16.265 31.2168H50.8521C51.8814 31.2168 52.7049 32.0447 52.7049 33.0796C52.7049 34.1145 51.8814 34.9424 50.8521 34.9424H16.265C15.2356 34.9424 14.4121 34.1145 14.4121 33.0796C14.4121 32.0447 15.2356 31.2168 16.265 31.2168Z" fill="#FFFBFF" />
                                    </svg>

                                </Box>
                                <Box>
                                    <Typography variant="body1" fontSize={24}>PassBiz  (Muy Pronto)</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body1" fontSize={20}>
                                    {t('cards.card3.text3')} <span style={{ color: '#B7C4FF' }}>{t('cards.card3.text4')} </span> {t('cards.card3.text5')} <span style={{ color: '#B7C4FF' }}>{t('cards.card3.text6')}</span> {t('cards.card3.text7')}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box p={4} display={'flex'} flexDirection={"column"} gap={2}   >
                        <Typography variant="body1" fontSize={22} fontFamily={karla.style.fontFamily}>
                            {t('cards.card3.allow')}
                        </Typography>
                        <Typography variant="body1" fontSize={16} fontFamily={karla.style.fontFamily}>
                           - {t('cards.card3.text8')}
                        </Typography>
                        <Typography variant="body1" fontSize={16} fontFamily={karla.style.fontFamily}>
                           - {t('cards.card3.text9')}
                        </Typography>
                        <Typography variant="body1" fontSize={16} fontFamily={karla.style.fontFamily}>
                           - {t('cards.card3.text10')}
                        </Typography>
                    </Box>
                </Box>
                <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2}  >
                    <Box borderRadius={2} p={2} display={'flex'} flexDirection={"column"} gap={1} sx={{ background: (theme) => theme.palette.primary.dark, color: "#FFF" }}>

                        <Box borderRadius={2} p={2} display={'flex'} flexDirection={"column"} alignItems={'flex-start'} gap={2}  >

                            <Box display={'flex'} flexDirection={'row'} alignItems={'flex-start'} justifyContent={'center'} gap={2}>
                                <svg width="61" height="75" viewBox="0 0 61 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.8523 32.2709C34.9128 32.2709 38.2046 28.9643 38.2046 24.8855C38.2046 20.8066 34.9128 17.5 30.8523 17.5C26.7917 17.5 23.5 20.8066 23.5 24.8855C23.5 28.9643 26.7917 32.2709 30.8523 32.2709Z" stroke="#FFFBFF" stroke-width="4" stroke-miterlimit="10" />
                                    <path d="M30.1689 0C46.7788 0.000125346 60.3378 13.2502 60.3379 29.7139C60.3379 37.5176 58.564 45.1766 54.041 52.5957C49.5407 59.9775 42.4334 66.9344 32.0498 73.5537L30.2129 74.7246L28.3506 73.5928C9.01677 61.8425 0 45.636 0 29.7139C8.398e-05 13.2502 13.5589 0 30.1689 0ZM30.1689 7C17.3122 7 7.00008 17.2279 7 29.7139C7 35.2289 8.31381 40.9419 11.168 46.5117C13.0499 41.8492 19.0229 38.5 30.5 38.5C41.6215 38.5 47.5748 41.6448 49.6455 46.082C52.2657 40.7894 53.3379 35.3602 53.3379 29.7139C53.3378 17.228 43.0255 7.00012 30.1689 7Z" fill="#FFFBFF" />
                                    <path d="M30.1172 22.6694V25.3282L33.7933 27.1007" stroke="#FFFBFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <Typography variant="body1" fontSize={24}>CheckBiz</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" fontSize={20} >
                                    {t('cards.card3.text11')}<span style={{ color: '#B7C4FF' }}>{t('cards.card3.text12')}</span>{t('cards.card3.text13')}                        </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box p={4} display={'flex'} flexDirection={"column"} gap={2}   >
                        <Typography variant="body1" fontSize={22} fontFamily={karla.style.fontFamily}>
                            {t('cards.card3.allow')}
                        </Typography>
                        <Typography variant="body1" fontSize={16} fontFamily={karla.style.fontFamily}>
                            - {t('cards.card3.text16')}
                        </Typography>
                        <Typography variant="body1" fontSize={16} fontFamily={karla.style.fontFamily}>
                            - {t('cards.card3.text17')}
                        </Typography>
                        <Typography variant="body1" fontSize={16} fontFamily={karla.style.fontFamily}>
                            - {t('cards.card3.text18')}
                        </Typography>
                        <Typography variant="body1" fontSize={16} fontFamily={karla.style.fontFamily}>
                            - {t('cards.card3.text19')}
                        </Typography>
                    </Box>
                </Box>
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
