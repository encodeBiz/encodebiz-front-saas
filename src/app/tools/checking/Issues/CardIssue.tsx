import { CustomChip } from "@/components/common/table/CustomChip"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { CommonModalType } from "@/contexts/commonModalContext"
import { IIssue } from "@/domain/features/checkinbiz/IIssue"
import { useCommonModal } from "@/hooks/useCommonModal"
import { format_date } from "@/lib/common/Date"
import { AccessTime, HomeWork, CalendarToday } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import { useTranslations } from "next-intl"

export const CardIssue = ({ row }: { row: IIssue }) => {
    const { openModal } = useCommonModal()
    const t = useTranslations()

    return <BorderBox

        sx={{ p: 2, width: '100%', bgcolor: '#FFFFFF' }} 
        onClick={() => {
            openModal(CommonModalType.ISSUES_RESPONSE, { issueId: row.id })
        }}
    >
        <Box display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                    <AccessTime sx={{ color: theme => theme.palette.primary.dark }} />
                    <Typography sx={{ fontSize: 14, color: theme => theme.palette.primary.dark }} fontWeight={'bold'} color='primary'>{row.comments}</Typography>
                </Box>

                <CustomChip small background={row.state} label={t('core.label.' + row.state)} />
            </Box>

            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                <HomeWork sx={{ color: theme => theme.palette.grey[800] }} />
                <Typography sx={{ fontSize: 12, color: theme => theme.palette.grey[800] }}>{row.branch?.name}</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'flex-start'} gap={1}>
                <CalendarToday sx={{ color: theme => theme.palette.grey[800] }} />
                <Typography sx={{ fontSize: 12, color: theme => theme.palette.grey[800] }}>{format_date(row.createdAt)}</Typography>
            </Box>
        </Box>

    </BorderBox>
}