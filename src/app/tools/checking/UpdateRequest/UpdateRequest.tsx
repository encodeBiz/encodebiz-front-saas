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
import { addUpdateRequest, fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";

import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { IChecklog } from '@/domain/features/checkinbiz/IChecklog';
import { format_date } from '@/lib/common/Date';
import { useCheck } from '../page.context';
import { getEmplyeeLogs } from '@/services/checkinbiz/employee.service';
import { useToast } from '@/hooks/useToast';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { fetchUserAccount } from '@/services/core/account.service';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { CustomChip } from '@/components/common/table/CustomChip';
import InfoModal from '@/components/common/modals/InfoModal';
const UpdateRequest = () => {
    const { sessionData } = useCheck()
    const t = useTranslations()
    const theme = useTheme()
    const [pending, setPending] = useState(false)
    const [employeeLogs, setEmployeeLogs] = useState<Array<IChecklog>>([])
    const { showToast } = useToast()
    const { open, closeModal } = useCommonModal()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [openConfirm, setOpenConfirm] = useState(false)
    const [item, setItem] = useState<IChecklog>()

    const getEmplyeeRequestUpdateRequestData = async (limit: number = 10) => {
        setPending(true)
        try {
            const filters: any = []
            const resultList: Array<IChecklog> = await getEmplyeeLogs(sessionData?.entityId || '', sessionData?.employeeId || '', sessionData?.branchId || '', { limit, orderBy: 'timestamp', orderDirection: 'desc', filters } as any) as Array<IChecklog>


            const data: Array<IChecklog> = await Promise.all(
                resultList.filter(e => e.metadata?.requestUpdates?.length > 0).map(async (item) => {

                    const branch = (await fetchSucursalData(sessionData?.entityId as string, item.branchId as string))
                    const employee = (await fetchEmployeeData(sessionData?.entityId as string, item.employeeId as string))
                    let requestUpdates: Array<any> = []
                    let requestUpdate: any
                    if (Array.isArray(item.metadata?.requestUpdates) && item.metadata?.requestUpdates.length > 0) {
                        requestUpdates = await Promise.all(
                            item.metadata?.requestUpdates.map(async (e: any) => {
                                const employee1 = (await fetchEmployeeData(sessionData?.entityId as string, e.data?.employeeId as string))
                                const admin = (await fetchUserAccount(e.updateBy as string))
                                return { ...e, employee: employee1, admin };
                            })
                        );
                        if (item.requestUpdate)
                            requestUpdate = requestUpdates.find(e => e.id === item.requestUpdate)
                        if (!requestUpdate)
                            requestUpdate = requestUpdates[0]
                    }
                    return { ...item, requestUpdates, branch, employee, requestUpdateData: requestUpdate };
                })
            );

            setEmployeeLogs(data)
            setPending(false)
        } catch (error) {
            setPending(false)
            showToast('Error fetchind logs data: ' + error, 'error')
        }

    }

    useEffect(() => {
        if (sessionData?.entityId)
            getEmplyeeRequestUpdateRequestData()
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
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start', textAlign: 'left', mt: 4 }}>
                    <Typography variant="body1" fontWeight={'bold'} fontSize={18} > {t('checking.requestUpdate')} </Typography>
                    {pending && <CircularProgress color="inherit" size={20} />}
                </Box>
                <CustomIconBtn
                    sx={{ position: 'absolute', top: 16, right: 26 }}
                    onClick={() => closeModal(CommonModalType.UPDATEREQUEST)}
                    color={theme.palette.primary.main}
                />
            </DialogTitle>
            <DialogContent  >
                <Box sx={{ pt: 4, position: 'relative', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {employeeLogs.map((row: IChecklog, index: number) => (
                        <BorderBox sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: theme => theme.palette.background.paper }} key={index}>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Typography variant='body2'>{t('core.label.branch')}:{row.branch?.name}</Typography>
                                    <Typography variant='body2'>{t('core.label.type')}:{row.type}</Typography>
                                </Box>
                                <CustomChip role={'text'} background={row.status} label={t('core.label.' + row.status)} />

                            </Box>
                            <Divider />
                            <Typography variant='body1' fontWeight={'bold'}>{t('core.label.changes')}</Typography>
                            <Typography variant='body1'>{row.requestUpdateData?.reason}</Typography>
                            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'flex-start'}>
                                <Typography variant='caption'>{t('core.label.previewDate')}: {format_date(row.requestUpdateData?.previousDate, 'DD/MM/YYYY hh:mm')}</Typography>
                                <Typography variant='caption'>{t('core.label.currentDate')}: {format_date(row.requestUpdateData?.data.timestamp, 'DD/MM/YYYY hh:mm')}</Typography>
                            </Box>
                            <Divider />
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                                {row.status === 'pending-employee-validation' && <SassButton sx={{ width: '100%' }} variant='contained' onClick={() => {
                                    setItem(row)
                                    setOpenConfirm(true)
                                }}>{t('checking.okdenied')}</SassButton>}
                            </Box>
                        </BorderBox>
                    ))}

                    {pending && <Box sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <CircularProgress color="inherit" size={20} />
                    </Box>}
                    {/*limit <= total && <SassButton variant='outlined' onClick={() => loadMore()} >{t('core.label.moreload')}</SassButton>*/}
                </Box>
            </DialogContent>
        </Dialog>

        {openConfirm && <InfoModal
            closeIcon={true} centerBtn
            decisiveAction={true}
            title={t('checking.updateRequestTitle')}
            description={t('checking.updateRequestText')}
            btnText={t('core.button.validate')}
            btnCloseText={t('core.button.reject')}
            onClose={async (key: any) => {
                if (key === 'valid' || key === 'failed') {
                    const status = key === 'valid' ? 'valid' : 'failed'                    
                    await addUpdateRequest(item as IChecklog, status, sessionData?.employeeId as string)
                    getEmplyeeRequestUpdateRequestData()
                }
                setOpenConfirm(false)
            }}
        />}
    </>
    );
};

export default UpdateRequest;
