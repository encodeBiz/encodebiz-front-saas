import { SassButton } from "@/components/common/buttons/GenericButton"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal"
import { useLayout } from "@/hooks/useLayout"
 import { Card, Box, Grid, Typography, CardContent, Paper, Divider, List, ListItem, ListItemText } from "@mui/material"
import { useTranslations } from "next-intl"
 
export const Detail = ({ branch, children }: { branch: ISucursal, children: React.ReactNode }) => {
    const t = useTranslations()
    const { navivateTo } = useLayout()
    const onGoMap = (lat: number, lng: number) => window.open(`http://www.google.com/maps?q=${lat},${lng}`, '_blank')
    return <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.secondary.main }}>
            <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>

                <Grid >
                    <Typography variant="h4"   >
                        {branch?.name}
                    </Typography>
                    <Typography variant="h6"  >

                        {t('sucursal.detailSucursal')}
                    </Typography>
                </Grid>

                <SassButton variant="contained" onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/sucursal`)}>
                    {t('core.button.back')}
                </SassButton>

            </Grid>


        </Box>

        <CardContent sx={{ p: 0 }}>

            <Paper elevation={0} sx={{ p: 3 }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                            {t('core.label.address')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {branch?.address?.street}
                        </Typography>
                    </Box>
                    <SassButton variant="outlined" onClick={() => onGoMap(branch.address.geo.lat, branch.address.geo.lng)}> {t('sucursal.map')}</SassButton>
                </Box>
            </Paper>
            <Divider />

            {/* Additional Details */}
            <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom  >
                    {t('core.label.aditionalData')}
                </Typography>

                {Array.isArray(branch.metadata) && <List>
                    {branch.metadata.map((e: any, i: number) => <ListItem key={i}>
                        
                        <ListItemText
                            primary={e.label}
                            secondary={e.value}
                        />
                    </ListItem>)}
                </List>}

            </Paper>

            <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                    {t("employee.list")}
                </Typography>

                {children}

            </Paper>
        </CardContent>
    </Card>

}