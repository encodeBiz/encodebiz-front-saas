import { CustomChip } from "@/components/common/table/CustomChip"
import { DetailText } from "@/components/common/table/DetailText"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { useLayout } from "@/hooks/useLayout"
import { ArrowBackOutlined } from "@mui/icons-material"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, Stack, Avatar } from "@mui/material"
import { useTranslations } from "next-intl"
import { IIssue } from "@/domain/features/checkinbiz/IIssue"
import { format_date } from "@/lib/common/Date"
import ReplyThread from "./components/ReplyThread"

export const Detail = ({ issue }: { issue: IIssue}) => {
    const t = useTranslations()
    const { navivateTo } = useLayout()


    return <Card elevation={3} sx={{ width: '100%', margin: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ p: 3, bgcolor: (theme) => theme.palette.secondary.main }}>
            <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>
                <Grid display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={2}>
                    <ArrowBackOutlined color="primary" style={{ fontSize: 45, cursor: 'pointer' }} onClick={() => {
                        navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/issues`)
                    }} />

                    <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main, mr: 2 }}>
                            {issue.employee?.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1">
                                {issue.employee?.fullName}, {issue?.branch?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {format_date(issue.createdAt)}
                            </Typography>
                            {' '}
                            <CustomChip role='ship' size='small' background={issue?.state} label={t('core.label.' + issue.state)} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>

        <CardContent sx={{ p: 0 }}>
            <Divider />
            <ReplyThread />
        </CardContent>


    </Card>

}