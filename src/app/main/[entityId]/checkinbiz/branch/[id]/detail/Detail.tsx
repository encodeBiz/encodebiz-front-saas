import { SassButton } from "@/components/common/buttons/GenericButton"
import { CustomChip } from "@/components/common/table/CustomChip"
import { DetailText } from "@/components/common/table/DetailText"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { CommonModalType } from "@/contexts/commonModalContext"
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal"
import { useCommonModal } from "@/hooks/useCommonModal"
import { useLayout } from "@/hooks/useLayout"
import { onGoMap } from "@/lib/common/maps"
import { ArrowBackOutlined } from "@mui/icons-material"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import FormModal from "../../edit/FormModal"

export const Detail = ({ branch, onSuccess, children }: { branch: ISucursal, children: React.ReactNode, onSuccess: () => void }) => {
    const t = useTranslations()
    const { navivateTo } = useLayout()
    const { openModal, open } = useCommonModal()

    return <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.secondary.main }}>
            <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>
                <Grid display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
                    <ArrowBackOutlined color="primary" style={{ fontSize: 45, cursor: 'pointer' }} onClick={() => {
                        navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch`)
                    }} />
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant="h4"   >
                            {branch?.name}
                        </Typography>
                        <Box display={'flex'} flexDirection={'row'} gap={1}>
                            {branch?.nit && <Typography variant="body1"   >
                                {t('core.label.nit')}: {branch?.nit}
                            </Typography>}
                            <CustomChip size='small' label={branch.disableRatioChecklog ? t('core.label.disableRatioChecklogD') : t('core.label.disableRatioChecklogE')} />
                        </Box>

                    </Box>
                </Grid>
                <Stack direction={'row'} gap={2}>
                    <SassButton color="primary" variant="contained" onClick={() => openModal(CommonModalType.FORM, { ...branch })}>
                        {t('core.button.edit')}
                    </SassButton>
                </Stack>

            </Grid>


        </Box>

        <CardContent sx={{ p: 0 }}>
            <Paper elevation={0} sx={{ p: 3 }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={2} alignItems={'flex-start'}>
                        <DetailText label={t('core.label.ratioChecklog2')} value={branch?.ratioChecklog + ' ' + t('core.label.meters')} orientation="row" help={t('sucursal.ratioHelp')} />
                        <DetailText label={t('core.label.address')} value={branch?.address?.street} orientation="row" >
                            <Typography fontSize={16}>{t('core.label.timeZone') + ": " + branch?.address?.timeZone}</Typography>
                            <Box sx={{ marginLeft: 4, minWidth: 140 }}><SassButton variant="text" onClick={() => onGoMap(branch.address.geo.lat, branch.address.geo.lng)}> {t('sucursal.map')}</SassButton></Box>
                        </DetailText>
                    </Box>
                </Box>

                <Divider sx={{ mt: 2 }} />
                <Typography variant="subtitle1" gutterBottom textTransform={'capitalize'} sx={{ mt: 2 }}>
                    {t('core.label.advance')}
                </Typography>

                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>

                    {branch?.advance && <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={4} alignItems={'flex-start'}>
                        <DetailText label={t('core.label.enableDayTimeRange')} value={branch?.advance?.enableDayTimeRange ? t('core.label.enable') : t('core.label.noenable')} />
                        {branch?.advance?.enableDayTimeRange && <DetailText label={t('core.label.periocityTime')} value={branch?.advance?.startTimeWorkingDay?.hour + ':' + branch?.advance?.startTimeWorkingDay?.minute + ' - ' + branch?.advance?.endTimeWorkingDay?.hour + ':' + branch?.advance?.endTimeWorkingDay?.minute} />}

                        <DetailText label={t('core.label.disableBreak')} value={branch?.advance?.disableBreak ? t('core.label.yes') : t('core.label.no')} />
                        {branch?.advance?.disableBreak && <DetailText label={t('core.label.breakTimeRange')} value={branch?.advance?.timeBreak + ' ' + t('core.label.minutes')} />}

                    </Box>}
                </Box>

                {Array.isArray(branch.metadata) && branch.metadata.length > 0 && <><Divider /> <Paper sx={{ mt: 4 }} elevation={0} >
                    <Typography variant="subtitle1" gutterBottom textTransform={'capitalize'} >
                        {t('core.label.aditionalData')}
                    </Typography>

                    {Array.isArray(branch.metadata) && <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} alignItems={'flex-start'} gap={2}>
                        {branch.metadata.map((e: any, i: number) => <DetailText key={i} label={e.label} value={e.value} orientation="row" />)}
                    </Box>}
                </Paper></>}
            </Paper>



            <Divider />

            <Paper elevation={0} sx={{ p: 3 }}>
                <Box display={'flex'} justifyContent={'space-between'} alignContent={'center'} mb={2}>
                    <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                        {t("employee.list")}
                    </Typography>
                    <SassButton color="primary" variant="contained" onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee/add?branchId=${branch?.id}`)}>
                        {t('employee.add')}
                    </SassButton>
                </Box>
                {children}

            </Paper>
        </CardContent>
        {open.type === CommonModalType.FORM && <FormModal onSuccess={onSuccess} />}

    </Card>

}