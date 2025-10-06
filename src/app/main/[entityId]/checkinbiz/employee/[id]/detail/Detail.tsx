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
import { CustomChip } from "@/components/common/table/CustomChip"

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
                    
                    <CustomChip size='small' background={employee?.twoFA ? 'active' : 'revoked'} label={employee?.twoFA ? t('core.label.enable2AF') : t('core.label.disable2AF')} />

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
                <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} alignItems={'flex-start'}>
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

                    {employee?.nationalId && <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                            {t('core.label.nationalId')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {employee?.nationalId}
                        </Typography>
                    </Box>}

                    {employee?.jobTitle && <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                            {t('core.label.jobTitle')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {employee?.jobTitle}
                        </Typography>
                    </Box>}
                </Box>
            </Paper>
            <Divider />

            {/* Additional Details */}
            {Array.isArray(employee.metadata) && employee.metadata.length > 0 && <> <Divider /><Paper elevation={0} sx={{ p: 3 }}>
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

            </Paper></>}

            <Divider />

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
            onOKAction={() => onDelete(employee)}
        />}
    </Card>

}