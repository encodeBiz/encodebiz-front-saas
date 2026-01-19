import { SassButton } from "@/components/common/buttons/GenericButton";
import { format_date } from "@/lib/common/Date";
import { onGoMap } from "@/lib/common/maps";
import { Stack, Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const LogDetail = ({ logDetail }: { logDetail: any }) => {
    const t = useTranslations()
 

    return <Stack spacing={2.5}>


        <Box  >

            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>{t('attendance.logDetail.summaryTitle')}</Typography>

            <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.recordTypeLabel')}</Typography>
                        <Typography >{t('core.label.' + (logDetail.type ?? ''))}</Typography>
                    </Box>
                </li>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.recordStatusLabel')}</Typography>
                        <Typography >{t('core.label.' + (logDetail.status ?? ''))}</Typography>
                    </Box>
                </li>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.dateTimeLabel')}</Typography>
                        <Typography > {format_date(logDetail.timestamp, 'DD/MM/YYYY HH:mm:ss', logDetail.metadata?.tz ?? logDetail.metadata?.etz)}</Typography>
                    </Box>
                </li>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.timezoneLabel')}</Typography>
                        <Typography > {logDetail.metadata?.tz ?? logDetail.metadata?.etz ?? '-'}</Typography>
                    </Box>
                </li>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.suspiciousRecordLabel')}</Typography>
                        <Typography >{logDetail.isSuspect ? t('core.label.yes') : t('core.label.no')}</Typography>
                    </Box>
                </li>
            </ul>
        </Box>

        <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>{t('attendance.logDetail.locationValidationTitle')}</Typography>
             <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.coordinatesLabel')}</Typography>
                        <Typography >{logDetail.geo?.lat?.toFixed(6)}, {logDetail.geo?.lng?.toFixed(6)}</Typography>
                    </Box>
                </li>
                
                {logDetail.disableRatioChecklog && <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.distanceToAuthorizedPointLabel')}</Typography>
                        <Typography >{Number(logDetail.metadata?.distance ?? 0).toFixed(2)} {t('attendance.logDetail.meters')}</Typography>
                    </Box>
                </li>}
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('core.label.' + logDetail.disableRatioChecklog ? t('core.label.disableRatioChecklogD') : t('core.label.disableRatioChecklogE'))}</Typography>
                    </Box>
                </li>

            </ul>

           
            <SassButton size="small" variant="outlined" onClick={() => onGoMap(logDetail.geo?.lat as number, logDetail.geo?.lng as number)} sx={{ mt: 1, border: 0 }}>
                {t('attendance.logDetail.viewLocationOnMap')}
            </SassButton>
        </Box>


        <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>{t('attendance.logDetail.workdayConditionsTitle')}</Typography>
            <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{logDetail.metadata?.enableDayTimeRange ? t('attendance.logDetail.strictSchedule') : t('attendance.logDetail.flexibleSchedule')}</Typography>
                    </Box>
                </li>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.appliedScheduleLabel')}</Typography>
                        <Typography >{`${(logDetail.metadata?.scheduleApplied?.start?.hour ?? 0).toString().padStart(2, '0')}:${(logDetail.metadata?.scheduleApplied?.start?.minute ?? 0).toString().padStart(2, '0')}`} - {`${(logDetail.metadata?.scheduleApplied?.end?.hour ?? 0).toString().padStart(2, '0')}:${(logDetail.metadata?.scheduleApplied?.end?.minute ?? 0).toString().padStart(2, '0')}`}</Typography>
                    </Box>
                </li>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.scheduleNoticeLabel')}</Typography>
                        <Typography > {logDetail?.branch?.advance?.notifyBeforeMinutes} {t('attendance.logDetail.minutesBeforeEntryAndExit')}</Typography>
                    </Box>
                </li>
            </ul>

            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{t('attendance.logDetail.workModality')}</Typography>
            <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.remoteWorkLabel')}</Typography>
                        <Typography >{logDetail.metadata?.enableRemoteWork ? t('core.label.yes') : t('core.label.no')}</Typography>
                    </Box>
                </li>
            </ul>
        </Box>


        <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>{t('attendance.logDetail.roleAndCostTitle')}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{t('attendance.logDetail.assignedResponsibility')}</Typography>
            <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.areaLabel')}</Typography>
                        <Typography >{logDetail.metadata?.employeeResponsibility?.job ?? '-'}</Typography>
                    </Box>
                </li>

                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.roleLabel')}</Typography>
                        <Typography >{logDetail.metadata?.employeeResponsibility?.responsibility ?? '-'}</Typography>
                    </Box>
                </li>

                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.levelLabel')}</Typography>
                        <Typography >{logDetail.metadata?.employeeResponsibility?.level ?? '-'}</Typography>
                    </Box>
                </li>
            </ul>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{t('attendance.logDetail.priceTitle')}</Typography>
            <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.pricePerHourLabel')}</Typography>
                        <Typography >{logDetail.metadata?.employeeResponsibility?.price ?? '-'}</Typography>
                    </Box>
                </li>
            </ul>
        </Box>


        <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>{t('attendance.logDetail.auditTitle')}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{t('attendance.logDetail.lastUpdate')}</Typography>
            <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.updatedOnLabel')}</Typography>
                        <Typography >{logDetail.metadata?.updated?.updatedAt ? format_date(logDetail.metadata?.updated?.updatedAt, 'DD/MM/YYYY HH:mm:ss', logDetail.metadata?.tz ?? logDetail.metadata?.etz) : '-'}</Typography>
                    </Box>
                </li>

                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.updatedByLabel')}</Typography>
                        <Typography >{logDetail.employee?.fullName ?? '-'}</Typography>
                    </Box>
                </li>

            </ul>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{t('attendance.logDetail.technicalInformation')}</Typography>
            <ul style={{ margin: 0 }}>
                <li style={{ fontSize: 16, fontWeight: 400, }}>
                    <Box display={'flex'} gap={1}>
                        <Typography fontWeight={700}>{t('attendance.logDetail.registeredUserAgentLabel')}</Typography>
                        <Typography >{logDetail.userAgent ?? '-'}</Typography>
                    </Box>
                </li>
            </ul>
        </Box>




    </Stack>
}