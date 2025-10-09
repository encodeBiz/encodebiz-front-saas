import { SassButton } from "@/components/common/buttons/GenericButton"
import { DetailText } from "@/components/common/table/DetailText"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal"
import { useLayout } from "@/hooks/useLayout"
import { ArrowBackOutlined } from "@mui/icons-material"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, Stack } from "@mui/material"
import { useTranslations } from "next-intl"

export const Detail = ({ branch, children }: { branch: ISucursal, children: React.ReactNode }) => {
    const t = useTranslations()
    const { navivateTo } = useLayout()
    const onGoMap = (lat: number, lng: number) => window.open(`http://www.google.com/maps?q=${lat},${lng}`, '_blank')
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
                        {branch?.nit && <Typography variant="body1"   >
                            {t('core.label.nit')}: {branch?.nit}
                        </Typography>}   </Box>
                </Grid>
                <Stack direction={'row'} gap={2}>
                    <SassButton color="primary" variant="contained" onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/branch/${branch.id}/edit`)}>
                        {t('core.button.edit')}
                    </SassButton>
                </Stack>

            </Grid>


        </Box>

        <CardContent sx={{ p: 0 }}>
            <Paper elevation={0} sx={{ p: 3 }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={2} alignItems={'flex-start'}>
                        <DetailText label={t('core.label.ratioChecklog2')} value={branch?.ratioChecklog +' '+ t('core.label.meters')} orientation="row" help={t('sucursal.ratioHelp')} />
                        <DetailText label={t('core.label.address')} value={branch?.address?.street} orientation="row" >
                            <Box sx={{ marginLeft: 4, minWidth: 140 }}><SassButton variant="text" onClick={() => onGoMap(branch.address.geo.lat, branch.address.geo.lng)}> {t('sucursal.map')}</SassButton></Box>
                        </DetailText>
                    </Box>
                </Box>

                {Array.isArray(branch.metadata) && branch.metadata.length > 0 && <><Divider /> <Paper sx={{ mt: 4 }} elevation={0} >
                    <Typography variant="subtitle1" gutterBottom  textTransform={'capitalize'} >
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
    </Card>

}