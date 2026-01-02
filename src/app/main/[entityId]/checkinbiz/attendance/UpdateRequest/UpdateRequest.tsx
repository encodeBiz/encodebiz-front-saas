import { useAppLocale } from "@/hooks/useAppLocale";
import { format_date, format_date_with_locale } from "@/lib/common/Date";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export const UpdateRequest = ({ logDetail }: { logDetail: any }) => {
    const t = useTranslations()
    const {currentLocale} = useAppLocale()
    return <Box display={'flex'} flexDirection={'column'} gap={3}>

            <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
              <Typography variant='body1' sx={{ fontSize: 16, color: "#48494C" }}>
                {logDetail?.item?.data?.status === 'valid' ? t('attendance.updateRequestStatusOk') : t('attendance.updateRequestStatusError')}
              </Typography>
            </Box>
            <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
              <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
                {t('attendance.updateRequestChanged')}
              </Typography>


              <Typography variant='body1' sx={{ fontSize: 15, fontWeight: 'bold', color: "#1C1B1D" }}>
                {t('attendance.latestData')}
              </Typography>
              <ul style={{ marginLeft: -12, margin: 2 }} >
                <li >
                  <Box style={{ display: 'flex', gap: 2 }}>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                      {t('attendance.updateRequestPreviewStatus')}:
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                      {t('core.label.' + logDetail?.item?.previousStatus)}

                    </Typography>
                  </Box>
                </li>

                <li >
                  <Box style={{ display: 'flex', gap: 2 }}>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                      {t('attendance.updateRequestDate')}:
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                      <Typography variant="body2" textTransform={'capitalize'}>{format_date_with_locale(logDetail?.item?.previousDate, currentLocale as 'en' | 'es')}</Typography>
                    </Typography>
                  </Box>
                </li>


              </ul>

              <Typography variant='body1' sx={{ fontSize: 15, fontWeight: 'bold', color: "#1C1B1D" }}>
                {t('attendance.currentData')}
              </Typography>
              <ul style={{ marginLeft: -12, margin: 2 }} >
                <li >
                  <Box style={{ display: 'flex', gap: 2 }}>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                      {t('attendance.updateRequestStatus')}:
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>
                      {t('core.label.' + logDetail?.item?.data?.status)}
                    </Typography>
                  </Box>
                </li>

                <li >
                  <Box style={{ display: 'flex', gap: 2 }}>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                      {t('attendance.updateRequestTime')}:
                    </Typography>
                    <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C", textTransform: 'capitalize' }}>

                      <Typography variant="body2" textTransform={'capitalize'}>{format_date_with_locale(logDetail?.item?.data?.timestamp, currentLocale as 'en' | 'es')}</Typography>
                    </Typography>
                  </Box>
                </li>
              </ul>
            </Box>


            <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
              <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
                {t('attendance.updateRequestReason')}:
              </Typography>
              <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
                {logDetail?.item?.reason}
              </Typography>
            </Box>

            <Box style={{ display: 'flex', gap: 1 }} flexDirection={'column'}>
              <Typography variant='body1' sx={{ fontSize: 16, color: "#1C1B1D" }}>
                {t('attendance.updateRequestValidate')}:
              </Typography>
              <Box style={{ display: 'flex', gap: 2 }}>
                <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                  {t('attendance.updateRequestRequest')}:
                </Typography>
                <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
                  {logDetail?.item?.admin?.fullName}
                </Typography>
              </Box>
              <Box style={{ display: 'flex', gap: 2 }}>
                <Typography variant='body1' sx={{ fontSize: 12, color: "#1C1B1D" }}>
                  {t('attendance.updateRequestRequestDate')}:
                </Typography>
                <Typography variant='body1' sx={{ fontSize: 12, color: "#48494C" }}>
                  {format_date(logDetail?.item?.createdAt)}
                </Typography>
              </Box>
            </Box>



          </Box>
}