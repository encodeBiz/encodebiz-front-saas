/* eslint-disable react-hooks/exhaustive-deps */
import { SassButton } from "@/components/common/buttons/GenericButton"
import { CustomChip } from "@/components/common/table/CustomChip"
import { DetailText } from "@/components/common/table/DetailText"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { CommonModalType } from "@/contexts/commonModalContext"
import { ISucursal, WorkSchedule } from "@/domain/features/checkinbiz/ISucursal"
import { useCommonModal } from "@/hooks/useCommonModal"
import { useLayout } from "@/hooks/useLayout"
import { onGoMap } from "@/lib/common/maps"
import { ArrowBackOutlined } from "@mui/icons-material"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import FormModal from "../../edit/FormModal"
import InfoModal from "@/components/common/modals/InfoModal"
import { EmployeeList } from "./components/EmployeeList"
import HelpTabs from "@/components/features/dashboard/HelpTabs/HelpTabs"
import { PanelStats } from "./dashboard/PanelStats"
import { useDashboardBranch } from "./dashboard/DashboardBranchContext"
import { useEffect } from "react"
import { useEntity } from "@/hooks/useEntity"
import WorkScheduleDetail from "./components/WorkScheduleDetail"

export const Detail = ({ branch, onSuccess, children, addResponsabiltyItem }: { addResponsabiltyItem: () => void, branch: ISucursal, children: React.ReactNode, onSuccess: () => void }) => {
    const t = useTranslations()
    const { navivateTo } = useLayout()
    const { openModal, open } = useCommonModal()
    const { initialize, branchPatternList, pending } = useDashboardBranch()
    const { currentEntity } = useEntity()

    useEffect(() => {
        if (currentEntity?.entity?.id) {
            initialize()
        }
    }, [currentEntity?.entity?.id])

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
                        {/** <DetailText label={t('core.label.timeZone')} value={branch?.address?.timeZone} orientation="row" />*/}

                    </Box>
                </Box>

                <Divider sx={{ mt: 2 }} />


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

            {branch?.id && <HelpTabs small tabs={[
                ...[
                    {
                        id: '1',
                        title: t(`core.label.workSchedule`),
                        tabContent: <WorkScheduleDetail
                            schedule={branch.advance?.workSchedule as WorkSchedule}
                            branch={branch}
                            notifyBeforeMinutes={branch.advance?.notifyBeforeMinutes as number}

                        />
                    },
                ],

                ...(branchPatternList.length > 0 && !pending ? [
                    {
                        id: '1',
                        title: t(`sucursal.panel`),
                        tabContent: <PanelStats />
                    },
                ] : []),


                {
                    id: '2',
                    title: t("employee.list"),
                    tabContent: <EmployeeList addResponsabiltyItem={addResponsabiltyItem} >{children}</EmployeeList>
                },


            ]} />}


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
