import { SassButton } from "@/components/common/buttons/GenericButton"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee"
import { useLayout } from "@/hooks/useLayout"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import useEmployeeDetailController from "./page.controller"
import { useCommonModal } from "@/hooks/useCommonModal"
import ConfirmModal from "@/components/common/modals/ConfirmModal"
import { CommonModalType } from "@/contexts/commonModalContext"
import { CustomChip } from "@/components/common/table/CustomChip"
import { useSearchParams } from "next/navigation"
import { DetailText } from "@/components/common/table/DetailText"
import { ArrowBackOutlined } from "@mui/icons-material"
import FormModal from "../../edit/FormModal"
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs"
import { Branch } from "./Attedance/Branch"
import { Attedance } from "./Attedance/Attedance"
import { onGoMap } from "@/lib/common/maps"

export const Detail = ({ employee, onResend, onSuccess, children }: { employee: IEmployee, onSuccess: () => void, onResend: (v: IEmployee) => void, children: React.ReactNode }) => {
    const t = useTranslations()
    const { onDelete, deleting } = useEmployeeDetailController()
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
                        <Box display={'flex'} flexDirection={'row'} gap={1}>
                            <CustomChip size='small' background={employee?.twoFA ? 'active' : 'revoked'} label={employee?.twoFA ? t('core.label.enable2AF') : t('core.label.disable2AF')} />
                            <CustomChip size='small' label={employee.enableRemoteWork ? t('core.label.enableRemoteWorkEnable') : t('core.label.enableRemoteWorkDisabled')} />
                        </Box>
                    </Box>
                </Grid>
                <Stack direction={'row'} gap={2}>

                    <SassButton color="primary" variant="contained" onClick={() => openModal(CommonModalType.FORM, { ...employee })}>
                        {t('core.button.edit')}
                    </SassButton>

                    <SassButton color="primary" variant="contained" onClick={() => onResend(employee)}>
                        {t('core.button.resend')}
                    </SassButton>

                    <SassButton loading={deleting} color="error" variant="contained" onClick={() => openModal(CommonModalType.DELETE)}>
                        {t('core.button.delete')}
                    </SassButton>
                </Stack>

            </Grid>


        </Box>

        <CardContent sx={{ p: 0 }}>

            <Paper elevation={0} sx={{ p: 3 }}>

                <Typography variant="subtitle1" gutterBottom textTransform={'uppercase'} >
                    {t('employee.detailSucursal')}
                </Typography>
                <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={6} alignItems={'flex-start'}>
                    <DetailText label={t('core.label.email')} value={employee?.email} />
                    <DetailText label={t('core.label.phone')} value={'+' + employee?.phone} />
                    <DetailText label={t('core.label.status')} value={t('core.label.' + employee?.status)} />
                    <DetailText label={t('core.label.nationalId')} value={employee?.nationalId} />
                    <DetailText label={t('core.label.remoteWork')} value={employee?.enableRemoteWork ? t('core.label.enable') : t('core.label.noenable')} />
                </Box>

                {employee?.enableRemoteWork && !!employee?.metadata?.find((e: any) => e.label === 'address') && <Paper sx={{ mt: 4 }} elevation={0} >
                    <Typography variant="subtitle1" gutterBottom textTransform={'uppercase'} >
                        {t('employee.enableRemoteWorkData')}
                    </Typography>

                    <DetailText label={t('core.label.address')} value={employee?.metadata?.find((e: any) => e.label === 'address')?.value?.street} orientation="row" >
                        <Box sx={{ marginLeft: 4, minWidth: 140 }}><SassButton variant="text" onClick={() => onGoMap(employee?.metadata?.find((e: any) => e.label === 'address')?.value.geo.lat, employee?.metadata?.find((e: any) => e.label === 'address')?.value.geo.lng)}> {t('sucursal.map')}</SassButton></Box>
                    </DetailText>
                    <DetailText label={t('core.label.timeZone')} value={employee?.metadata?.find((e: any) => e.label === 'address')?.value.timeZone} orientation="row" />
                    <DetailText label={t('core.label.country')} value={employee?.metadata?.find((e: any) => e.label === 'address')?.value.country} orientation="row" />
                    <DetailText label={t('core.label.city')} value={employee?.metadata?.find((e: any) => e.label === 'address')?.value.city} orientation="row" />


                </Paper>}

                {/* Additional Details */}
                {Array.isArray(employee.metadata?.filter((e: any) => e.label !== 'address')) && employee.metadata?.filter((e: any) => e.label !== 'address').length > 0 && <> <Paper sx={{ mt: 8 }} elevation={0} >
                    <Typography variant="subtitle1" gutterBottom textTransform={'uppercase'} >
                        {t('core.label.aditionalData')}
                    </Typography>

                    {Array.isArray(employee.metadata) && <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} alignItems={'flex-start'} gap={2}>
                        {employee.metadata?.filter(e => e.label !== 'address')?.map((e: any, i: number) => <DetailText key={i} label={e.label} value={e.value} orientation="row" />)}
                    </Box>}
                </Paper></>}
            </Paper>
            <Divider />

            <HelpTabs small tabs={[
                {
                    id: '1',
                    title: t(`core.label.sucursalAsigned`),
                    tabContent: <Branch employee={employee} />
                },
                {
                    id: '2',
                    title: t("checklog.list"),
                    tabContent: <Attedance>{children}</Attedance>
                },

            ]} />

        </CardContent>

        {
            open.type === CommonModalType.DELETE && !open?.args?.responsability && <ConfirmModal
                isLoading={deleting}
                title={t('employee.deleteConfirmModalTitle')}
                description={t('employee.deleteConfirmModalTitle2')}
                onOKAction={() => onDelete(employee)}
            />
        }

        {open.type === CommonModalType.FORM && <FormModal onSuccess={onSuccess} />}
        {open.type === CommonModalType.INFO && <FormModal onSuccess={onSuccess} />}



    </Card >

}