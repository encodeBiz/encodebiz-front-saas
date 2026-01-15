/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react';
import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';

import { useTranslations } from 'next-intl';
import { fetchSucursal as fetchSucursalData } from "@/services/checkinbiz/sucursal.service";
import { fetchEmployee as fetchEmployeeData, getIssues } from "@/services/checkinbiz/employee.service";
import emptyImage from '../../../../../public/assets/images/empty/datos.svg';

import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { format_date } from '@/lib/common/Date';
import { useCheck } from '../page.context';
import { useToast } from '@/hooks/useToast';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { CustomChip } from '@/components/common/table/CustomChip';
import EmptyList from '@/components/common/EmptyState/EmptyList';
import { IIssue } from '@/domain/features/checkinbiz/IIssue';
import { HomeOutlined, InfoOutline } from '@mui/icons-material';
import FormModal from './Form/edit/FormModal';
import { FormStatusProvider } from '@/contexts/formStatusContext';
import ReplyThread from './Detail/ReplyThread';
const Contact = () => {
    const { sessionData } = useCheck()
    const t = useTranslations()
    const theme = useTheme()
    const [pending, setPending] = useState(false)
    const [issues, setIssues] = useState<Array<IIssue>>([])
    const { showToast } = useToast()
    const { open, closeModal } = useCommonModal()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openResponse, setOpenResponse] = useState<{
        open: boolean,
        issue: null | IIssue
    }>({
        open: false,
        issue: null
    })

    const fetchIssues = async () => {
        setPending(true)
        try {

            const resultList: Array<IIssue> = await getIssues(sessionData?.entityId as string, {
                filters: [
                    {
                        field: 'employeeId',
                        operator: "==",
                        value: sessionData?.employeeId
                    }
                ]
            } as any) as Array<IIssue>
            const data: Array<IIssue> = await Promise.all(
                resultList.map(async (item) => {
                    const branch = (await fetchSucursalData(sessionData?.entityId as string, item.branchId as string))
                    const employee = (await fetchEmployeeData(sessionData?.entityId as string, item.employeeId as string))
                    return { ...item, branch, employee };
                })
            );



            setIssues(data)
            setPending(false)
        } catch (error) {
            setPending(false)
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    useEffect(() => {
        if (sessionData?.entityId)
            fetchIssues()
    }, [sessionData?.entityId])


    return (<>
        <Dialog
            open={open.open}
            onClose={() => closeModal(CommonModalType.LOGS)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            fullScreen={isMobile}
            maxWidth={'lg'}
            slotProps={{ paper: { sx: { p: 0, borderRadius: 2, width: '100vw', height: '90vh', background: "#F0EFFD" } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start', justifyContent: 'space-between', textAlign: 'left', mt: 4, width: '100%' }}>
                    <Typography variant="body1" fontWeight={'bold'} fontSize={18} > {t('checking.contact')} </Typography>
                    <SassButton onClick={() => setOpenConfirm(true)} variant='contained'>{t('core.button.add')}</SassButton>
                </Box>
                <CustomIconBtn
                    sx={{ position: 'absolute', top: 16, right: 26 }}
                    onClick={() => closeModal(CommonModalType.CONTACT_CHECKING)}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent  >
                <Box sx={{ pt: 4, position: 'relative', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {issues.map((row: IIssue, index: number) => (
                        <BorderBox onClick={() => setOpenResponse({
                            open: true, issue: row
                        })} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: theme => theme.palette.background.paper }} key={index}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box display={'flex'} flexDirection={'row'} gap={1} justifyContent={'flex-start'} alignItems={'flex-start'}>
                                    <InfoOutline /> <Typography variant='body2'>{t('core.label.' + row?.type)}</Typography>
                                </Box>
                                <CustomChip role={'text'} background={row.state} label={t('core.label.' + row.state)} />
                            </Box>
                            <Divider />
                            <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                                <HomeOutlined />
                                <Typography variant='body2'> {row.branch?.name}</Typography>
                            </Box>
                            <Typography variant='body1'>{row.comments}</Typography>
                            <Typography variant='caption'>{format_date(row.createdAt, 'DD/MM/YYYY hh:mm')}</Typography>
                        </BorderBox>
                    ))}

                    {pending && <Box sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <CircularProgress color="inherit" size={20} />
                    </Box>}

                    {issues.length === 0 && !pending && <EmptyList
                        imageUrl={emptyImage}
                        title={t('checking.statsNoDataTitle')}
                        description={t('checking.contactNoDataText')}
                    />}

                    {/*limit <= total && <SassButton variant='outlined' onClick={() => loadMore()} >{t('core.label.moreload')}</SassButton>*/}
                </Box>
            </DialogContent>
        </Dialog>

        {openResponse.open && <ReplyThread open={openResponse.open} issue={openResponse.issue as IIssue} handleClose={() => setOpenResponse({ open: false, issue: null })} />}
        {openConfirm && <FormStatusProvider><FormModal openConfirm={openConfirm} handleClose={() => setOpenConfirm(false)} onSuccess={() => fetchIssues()} /></FormStatusProvider>}
    </>
    );
};

export default Contact;
