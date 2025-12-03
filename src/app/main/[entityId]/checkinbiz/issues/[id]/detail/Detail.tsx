import { CustomChip } from "@/components/common/table/CustomChip"
import { DetailText } from "@/components/common/table/DetailText"
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes"
import { useLayout } from "@/hooks/useLayout"
import { ArrowBackOutlined } from "@mui/icons-material"
import { Card, Box, Grid, Typography, CardContent, Paper, Divider, Stack } from "@mui/material"
import { useTranslations } from "next-intl"
import { ResponseList } from "./components/ResponseList"
import { IIssue } from "@/domain/features/checkinbiz/IIssue"
import { format_date } from "@/lib/common/Date"

export const Detail = ({ issue, children }: { issue: IIssue, children: React.ReactNode, onSuccess: () => void }) => {
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
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography variant="h4"   >
                            {issue?.comments}
                        </Typography>
                        <Box display={'flex'} flexDirection={'row'} gap={1}>
                            <Typography variant="body1"   >
                                {format_date(issue.createdAt)}
                            </Typography>
                            <CustomChip role='ship' size='small' background={issue?.state} label={t('core.label.' + issue.state)} />
                        </Box>

                    </Box>
                </Grid>
                <Stack direction={'row'} gap={2}>

                </Stack>

            </Grid>


        </Box>

        <CardContent sx={{ p: 0 }}>
            <Paper elevation={0} sx={{ p: 3 }}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
                    <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'} justifyContent={'flex-start'} gap={0} alignItems={'flex-start'}>
                        <DetailText label={t('core.label.employee')} value={issue?.employee?.fullName} orientation="row" />
                        <DetailText label={t('core.label.branch')} value={issue?.branch?.name} orientation="row" />
                    </Box>
                </Box>


            </Paper>



            <Divider />

            {issue?.id && <ResponseList >{children}</ResponseList>}


        </CardContent>


    </Card>

}