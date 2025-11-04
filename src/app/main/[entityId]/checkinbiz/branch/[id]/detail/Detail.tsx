import { SassButton } from "@/components/common/buttons/GenericButton"
import { CustomChip } from "@/components/common/table/CustomChip"
import { DetailText } from "@/components/common/table/DetailText"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { CommonModalType } from "@/contexts/commonModalContext"
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal"
import { useCommonModal } from "@/hooks/useCommonModal"
import { useLayout } from "@/hooks/useLayout"
import { onGoMap } from "@/lib/common/maps"
import { Add, ArrowBackOutlined } from "@mui/icons-material"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import FormModal from "../../edit/FormModal"
import InfoModal from "@/components/common/modals/InfoModal"

export const Detail = ({ branch, onSuccess, addResponsabiltyItem, children }: {addResponsabiltyItem:()=>void, branch: ISucursal, children: React.ReactNode, onSuccess: () => void }) => {
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
                            {branch?.nif && <Typography variant="body1"   >
                                {t('core.label.nif')}: {branch?.nif}
                            </Typography>}
                            <CustomChip role='ship' size='small' background={branch?.disableRatioChecklog ? 'disabled' : 'default'} label={branch.disableRatioChecklog ? t('core.label.disableRatioChecklogD') : t('core.label.disableRatioChecklogE')} />
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
                    <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={0} alignItems={'flex-start'}>
                        <DetailText label={t('core.label.ratioChecklog2')} value={branch?.ratioChecklog + ' ' + t('core.label.meters')} orientation="row" help={t('sucursal.ratioHelp')} />
                        <DetailText label={t('core.label.address')} value={branch?.address?.street} orientation="row" >
                            <Box sx={{ marginLeft: 4, minWidth: 140 }}><SassButton variant="text" onClick={() => onGoMap(branch.address.geo.lat, branch.address.geo.lng)}> {t('sucursal.map')}</SassButton></Box>
                        </DetailText>
                        <DetailText label={t('core.label.timeZone')} value={branch?.address?.timeZone} orientation="row" />

                    </Box>
                </Box>

                <Divider sx={{ mt: 2 }} />
                <Typography variant="subtitle1" gutterBottom textTransform={'capitalize'} sx={{ mt: 2 }}>
                    {t('core.label.advance')}
                </Typography>

                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>

                    {branch?.advance && <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={4} alignItems={'flex-start'}>
                        <DetailText help={t('employee.dayTimeHelp')} label={t('core.label.enableDayTimeRange')} value={branch?.advance?.enableDayTimeRange ? t('core.label.enable') : t('core.label.noenable')} />
                        <DetailText label={t('core.label.dayTimeRange')} value={((branch?.advance?.startTimeWorkingDay?.hour as number) < 10 ? '0' + branch?.advance?.startTimeWorkingDay?.hour : branch?.advance?.startTimeWorkingDay?.hour) + ':' + ((branch?.advance?.startTimeWorkingDay?.minute as number) < 10 ? '0' + branch?.advance?.startTimeWorkingDay?.minute : branch?.advance?.startTimeWorkingDay?.minute) + ' - ' + ((branch?.advance?.endTimeWorkingDay?.hour as number) < 10 ? '0' + branch?.advance?.endTimeWorkingDay?.hour : branch?.advance?.endTimeWorkingDay?.hour) + ':' + ((branch?.advance?.endTimeWorkingDay?.minute as number) < 10 ? '0' + branch?.advance?.endTimeWorkingDay?.minute : branch?.advance?.endTimeWorkingDay?.minute)} />
                        <DetailText help={t('employee.breakHelp')} label={t('core.label.disableBreak')} value={branch?.advance?.disableBreak ? t('core.label.yes') : t('core.label.no')} />
                        <DetailText label={t('core.label.breakTimeRange')} value={branch?.advance?.timeBreak + ' ' + t('core.label.minutes')} />

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

                    <SassButton
                        onClick={addResponsabiltyItem}
                        variant='contained'
                        startIcon={<Add />}
                    >{t('sucursal.addEmployee')}</SassButton>
                </Box>
                {children}

            </Paper>
        </CardContent>
        {open.type === CommonModalType.FORM && open.args?.id !== 'responsability' && <FormModal onSuccess={onSuccess} />}

        {open.type === CommonModalType.INFO && open.args?.id === 'maxSelectionEmployee' && <InfoModal
            title={t('branch.linkToEmployeeNotTitle')}
            description={t('employee.linkToEmployeeNotText')}
            btnText={t('employee.linkToEmployeeNotBtn')}
            onClose={() => {
                navivateTo('/checkinbiz/employee')
            }}
            btnFill
            closeIcon
        />}

    </Card>

}