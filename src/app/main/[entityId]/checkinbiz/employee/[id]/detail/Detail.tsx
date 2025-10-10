import { SassButton } from "@/components/common/buttons/GenericButton"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee"
import { useLayout } from "@/hooks/useLayout"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, List, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import useEmployeeDetailController from "./page.controller"
import { useCommonModal } from "@/hooks/useCommonModal"
import ConfirmModal from "@/components/common/modals/ConfirmModal"
import { CommonModalType } from "@/contexts/commonModalContext"
import { CustomChip } from "@/components/common/table/CustomChip"
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal"
import { useSearchParams } from "next/navigation"
import { DetailText } from "@/components/common/table/DetailText"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { ArrowBackOutlined } from "@mui/icons-material"

export const Detail = ({ employee, children }: { employee: IEmployee, children: React.ReactNode }) => {
    const t = useTranslations()
    const { onDelete, deleting, branchListEmployee } = useEmployeeDetailController()
    const { openModal, open } = useCommonModal()
    const search = useSearchParams()
    const backAction = search.get('back')

    const { navivateTo } = useLayout()
    return <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.secondary.main }}>

            <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>
                <Grid display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
                    <ArrowBackOutlined color="primary" style={{ fontSize: 45, cursor: 'pointer' }} onClick={() => {
                        if (backAction) {
                            navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch/${backAction}/detail`)
                        } else {
                            navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee`)
                        }

                    }} />
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant="h4"   >
                            {employee?.fullName}
                        </Typography>
                        <CustomChip size='small' background={employee?.twoFA ? 'active' : 'revoked'} label={employee?.twoFA ? t('core.label.enable2AF') : t('core.label.disable2AF')} />
                    </Box>
                </Grid>
                <Stack direction={'row'} gap={2}>

                    <SassButton color="primary" variant="contained" onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/${employee.id}/edit`)}>
                        {t('core.button.edit')}
                    </SassButton>

                    <SassButton loading={deleting} color="error" variant="contained" onClick={() => openModal(CommonModalType.DELETE)}>
                        {t('core.button.delete')}
                    </SassButton>
                </Stack>

            </Grid>


        </Box>

        <CardContent sx={{ p: 0 }}>

            <Paper elevation={0} sx={{ p: 3 }}>
                <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={6} alignItems={'flex-start'}>
                    <DetailText label={t('core.label.email')} value={employee?.email} />
                    <DetailText label={t('core.label.phone')} value={employee?.phone} />
                    <DetailText label={t('core.label.status')} value={t('core.label.' + employee?.status)} />
                    <DetailText label={t('core.label.nationalId')} value={employee?.nationalId} />
                </Box>

                {/* Additional Details */}
                {Array.isArray(employee.metadata) && employee.metadata.length > 0 && <> <Paper sx={{ mt: 4 }} elevation={0} >
                    <Typography variant="subtitle1" gutterBottom textTransform={'capitalize'} >
                        {t('core.label.aditionalData')}
                    </Typography>

                    {Array.isArray(employee.metadata) && <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} alignItems={'flex-start'} gap={2}>
                        {employee.metadata.map((e: any, i: number) => <DetailText key={i} label={e.label} value={e.value} orientation="row" />)}
                    </Box>}
                </Paper></>}
            </Paper>
            <Divider />
            <Paper elevation={0} sx={{ p: 3 }}>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {t('core.label.sucursalAsigned')}
                    </Typography>
                    {Array.isArray(branchListEmployee) && <BorderBox>
                        {branchListEmployee.map((e: ISucursal, i: number) => <Box minHeight={50} key={i}>
                            <Box sx={{ p: 2 }}>
                                {i === 0 && <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'flex-start'} >
                                    <Typography fontSize={16} color='#45474C' fontWeight={400} variant="subtitle1" minWidth={200}>
                                        {t('core.label.sucursal')}
                                    </Typography>
                                    <Typography fontSize={16} color='#45474C' fontWeight={400} variant="subtitle1"  >
                                        {t('core.label.cargo')}
                                    </Typography>
                                </Box>}
                                <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-start'} alignItems={'flex-start'} >
                                    <Typography fontSize={24} color='#1C1B1D' fontWeight={400} variant="body2" minWidth={200}   >
                                        {e.name}
                                    </Typography>
                                    <Typography fontSize={24} color='#1C1B1D' fontWeight={400} variant="body2"   >
                                        {employee.jobTitle}
                                    </Typography>
                                </Box>
                            </Box>
                            {branchListEmployee.length - 1 !== i && <Divider flexItem />}
                        </Box>)}
                    </BorderBox>}
                </Box>
            </Paper>

            <Divider />




            <Divider />

            <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                    {t("checklog.list")}
                </Typography>

                {children}

            </Paper>
        </CardContent>

        {
            open.type === CommonModalType.DELETE && <ConfirmModal
                isLoading={deleting}
                title={t('employee.deleteConfirmModalTitle')}
                description={t('employee.deleteConfirmModalTitle2')}
                onOKAction={() => onDelete(employee)}
            />
        }
    </Card >

}