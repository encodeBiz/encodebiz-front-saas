import { Box, Typography, useTheme } from "@mui/material"
import Image from "next/image"
import logo from '../../../../../public/assets/images/logo.png'
import { SassButton } from "@/components/common/buttons/GenericButton"
import { useLayout } from "@/hooks/useLayout"
import { useCommonModal } from "@/hooks/useCommonModal"
import { CommonModalType } from "@/contexts/commonModalContext"

export const Card3 = ({ handleNext }: any) => {
    const theme = useTheme()
    const { navivateTo } = useLayout()
    const { closeModal } = useCommonModal()
    return <Box display={'flex'} flexDirection={"column"} justifyContent={'space-between'} p={2} height={631}>
        <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2} justifyContent={'space-between'} alignItems={'flex-start'} >
            <Image
                width={220}
                height={73}
                alt=""
                src={logo}
            />
            <Typography marginTop={2} variant="h3">Hoy con encodeBiz SaaS</Typography>
            <Box display={'flex'} flexDirection={"column"} gap={2}>
                <Typography variant="body1">Tu primer servicio,</Typography>
            </Box>
            <Box display={'flex'} flexDirection={"row"} gap={5}  >
                <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2} sx={{ background: (theme) => theme.palette.primary.light }}>
                    <Box p={4} display={'flex'} flexDirection={"column"} alignItems={'flex-start'} gap={2} sx={{ background: (theme) => theme.palette.primary.dark, color: "#FFF" }}>
                        <svg width="76" height="81" viewBox="0 0 76 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2834_3112)">
                                <path d="M43.4289 17.4375H70.4325C72.1029 17.4375 73.2164 18.5625 73.2164 20.25V48.0938C68.7622 49.5 65.4215 53.1562 65.4215 57.6562C65.4215 62.1563 68.7622 65.8125 73.2164 67.2187V75.375C73.2164 77.0625 72.1029 78.1875 70.4325 78.1875H5.56806C3.89773 78.1875 2.78418 77.0625 2.78418 75.375V67.5C7.23839 66.0938 10.5791 62.4375 10.5791 57.9375C10.5791 53.4375 7.23839 49.7813 2.78418 48.375V20.5313C2.78418 18.8438 3.89773 17.7188 5.56806 17.7188H32.5717M35.0772 2.8125H40.645C42.3153 2.8125 43.4289 3.9375 43.4289 5.625V19.6875C43.4289 21.375 42.3153 22.5 40.645 22.5H35.0772C33.4069 22.5 32.2933 21.375 32.2933 19.6875V5.625C32.2933 3.9375 33.4069 2.8125 35.0772 2.8125Z" stroke="#FFFBFF" stroke-width="6" />
                                <path d="M22.5497 60.1875C24.5485 60.1875 26.1688 58.5505 26.1688 56.5313C26.1688 54.512 24.5485 52.875 22.5497 52.875C20.551 52.875 18.9307 54.512 18.9307 56.5313C18.9307 58.5505 20.551 60.1875 22.5497 60.1875Z" fill="#FFFBFF" />
                                <path d="M38.4179 60.1875C40.4166 60.1875 42.0369 58.5505 42.0369 56.5313C42.0369 54.512 40.4166 52.875 38.4179 52.875C36.4191 52.875 34.7988 54.512 34.7988 56.5313C34.7988 58.5505 36.4191 60.1875 38.4179 60.1875Z" fill="#FFFBFF" />
                                <path d="M53.1728 60.1875C55.1715 60.1875 56.7918 58.5505 56.7918 56.5313C56.7918 54.512 55.1715 52.875 53.1728 52.875C51.174 52.875 49.5537 54.512 49.5537 56.5313C49.5537 58.5505 51.174 60.1875 53.1728 60.1875Z" fill="#FFFBFF" />
                                <path d="M15.3121 29.5312H62.0814C63.4733 29.5312 64.5869 30.6562 64.5869 32.0625C64.5869 33.4687 63.4733 34.5938 62.0814 34.5938H15.3121C13.9202 34.5938 12.8066 33.4687 12.8066 32.0625C12.8066 30.6562 13.9202 29.5312 15.3121 29.5312Z" fill="#FFFBFF" />
                                <path d="M15.3121 35.7188H62.0814C63.4733 35.7188 64.5869 36.8438 64.5869 38.25C64.5869 39.6563 63.4733 40.7813 62.0814 40.7813H15.3121C13.9202 40.7813 12.8066 39.6563 12.8066 38.25C12.8066 36.8438 13.9202 35.7188 15.3121 35.7188Z" fill="#FFFBFF" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2834_3112">
                                    <rect width="76" height="81" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <Typography variant="body1" fontSize={24}>PassBiz</Typography>
                        <Typography variant="body1" fontSize={20}>
                            Servicio SaaS para <span style={{ color: theme.palette.primary.light }}>emitir y gestionar credenciales</span> y <span style={{ color: theme.palette.primary.light }}>pases de eventos</span> digitales desde un único panel.
                        </Typography>
                    </Box>
                    <Box p={4} display={'flex'} flexDirection={"column"} gap={2}   >
                        <Typography variant="body1" fontSize={20}>
                            Emitir credenciales digitales para empleados, estudiantes o clientes.
                        </Typography>
                        <Typography variant="body1" fontSize={20}>
                            Crear y gestionar eventos con pases para asistentes y staff.
                        </Typography>
                        <Typography variant="body1" fontSize={20}>
                            Controlar accesos de forma segura y en tiempo real.
                        </Typography>
                    </Box>
                </Box>
                <Box width={'100%'} display={'flex'} flexDirection={"column"} gap={2} sx={{ background: (theme) => theme.palette.primary.light }}>
                    <Box p={4} display={'flex'} flexDirection={"column"} alignItems={'flex-start'} gap={2} sx={{ background: (theme) => theme.palette.primary.dark, color: "#FFF" }}>
                        <svg width="76" height="94" viewBox="0 0 76 94" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M62.5 63L36.5 88.5L10.5 63C10.5 54.1226 18 47 36.5 47C55 47 62.5 54.1226 62.5 63Z" fill="#FFFBFF" />
                            <path d="M38 43C43.5228 43 48 38.5228 48 33C48 27.4772 43.5228 23 38 23C32.4771 23 28 27.4772 28 33C28 38.5228 32.4771 43 38 43Z" stroke="#FFFBFF" stroke-width="4" strokeMiterlimit="10" />
                            <path d="M68 37.9629C68 55.0601 60.2785 71.0997 36.5 86.2581C14.6518 72.9798 5 55.0601 5 37.9629C5 20.8658 19.0975 7 36.5 7C53.9025 7 68 20.8658 68 37.9629Z" stroke="#FFFBFF" stroke-width="7" strokeMiterlimit="10" />
                            <path d="M37 30V33.6L42 36" stroke="#FFFBFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <Typography variant="body1" fontSize={24}>CheckBiz</Typography>
                        <Typography variant="body1" fontSize={20}>
                            Servicio de control y gestión de asistencia.<span style={{ color: theme.palette.primary.light }}> Registra entradas y salidas con geolocalización</span>, organiza equipos y proyectos, y genera reportes en tiempo real.                        </Typography>
                    </Box>
                    <Box p={4} display={'flex'} flexDirection={"column"} gap={2} justifyContent={'center'} alignItems={'center'}  >
                        <Box display={'flex'} flexDirection={"column"} justifyContent={'flex-end'} alignItems={'flex-end'} gap={4}>
                            <SassButton fullWidth sx={{ width: '420' }} size="small" onClick={() => {
                                navivateTo(`/entity`)
                                closeModal(CommonModalType.ONBOARDING)
                            }} variant="contained" color="primary">Ir a Configurar Entidad</SassButton>
                            <SassButton fullWidth sx={{ width: '420' }} size="small" onClick={handleNext} variant="outlined" color="primary">Configurar mas tarde</SassButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>

    </Box>
}
