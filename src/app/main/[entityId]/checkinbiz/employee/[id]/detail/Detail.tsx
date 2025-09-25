import { SassButton } from "@/components/common/buttons/GenericButton"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee"
import { useLayout } from "@/hooks/useLayout"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, List, ListItem, ListItemText, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import useEmployeeDetailController from "./page.controller"
import { useCommonModal } from "@/hooks/useCommonModal"
import ConfirmModal from "@/components/common/modals/ConfirmModal"
import { CommonModalType } from "@/contexts/commonModalContext"

export const Detail = ({ employee, children }: { employee: IEmployee, children: React.ReactNode }) => {
    const t = useTranslations()
    const { onDelete, deleting } = useEmployeeDetailController()
    const { openModal, open } = useCommonModal()

    const { navivateTo } = useLayout()
    return <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.secondary.main }}>
            <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>

                <Grid >
                    <Typography variant="h4"   >
                        {employee?.fullName}
                    </Typography>
                    <Typography variant="h6"  >

                        {t('employee.detailSucursal')}
                    </Typography>
                </Grid>
                <Stack direction={'row'} gap={2}>
                <SassButton variant="contained" onClick={() => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/employee`)}>
                    {t('core.button.back')}
                </SassButton>

                <SassButton loading={deleting} color="error" variant="contained" onClick={() => openModal(CommonModalType.DELETE)}>
                    {t('core.button.delete')}
                </SassButton>
                </Stack>

            </Grid>


        </Box>

        <CardContent sx={{ p: 0 }}>

            <Paper elevation={0} sx={{ p: 3 }}>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                            {t('core.label.email')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {employee?.email}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                            {t('core.label.phone')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {employee?.phone}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
            <Divider />

            {/* Additional Details */}
            <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom  >
                    {t('core.label.aditionalData')}
                </Typography>

                {Array.isArray(employee.metadata) && <List>
                    {employee.metadata.map((e: any, i: number) => <ListItem key={i}>

                        <ListItemText
                            primary={e.label}
                            secondary={e.value}
                        />
                    </ListItem>)}
                </List>}

            </Paper>

            <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                    {t("checklog.list")}
                </Typography>

                {children}




            </Paper>
        </CardContent>

        {open.type === CommonModalType.DELETE && <ConfirmModal
            isLoading={deleting}
            title={t('employee.deleteConfirmModalTitle')}
            description={t('employee.deleteConfirmModalTitle2')}
            onOKAction={(args: { data: any }) => onDelete(args.data)}
        />}
    </Card>

}