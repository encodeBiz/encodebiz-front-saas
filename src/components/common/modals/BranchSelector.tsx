import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    List,
    ListItemButton,
    ListItemText,
    Autocomplete,
    TextField
} from '@mui/material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useTranslations } from 'next-intl';
import { SassButton } from '../buttons/GenericButton';
import { CustomTypography } from '../Text/CustomTypography';

interface BranchSelectorProps {
    branchList: Array<{ name: string, branchId: string }>
    onOKAction: (event: { name: string, branchId: string }) => void
    type?: 'item' | 'selector'
}
const BranchSelectorModal = ({ branchList, onOKAction, type = 'item' }: BranchSelectorProps): React.JSX.Element => {
    const { open, closeModal } = useCommonModal()
    const t = useTranslations()
    const [branchSelected, setBranchSelected] = useState<{ name: string, branchId: string }>()
    return (
        <Dialog
            open={open.open}
            //onClose={() => closeModal(CommonModalType.EVENT_SELECTED)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="sm"
            scroll={'paper'}
            slotProps={{ paper: { sx: { p: 2, borderRadius: 2, minHeight:120 } } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <CustomTypography >{t('checking.titleBranch')}</CustomTypography>
                </Box>
            </DialogTitle>
            <DialogContent>
                {type == 'item' && <List component="nav" aria-label="main mailbox folders">
                    {branchList.map((e, i) => <ListItemButton key={i}
                        selected={branchSelected?.branchId === e.branchId}
                        onClick={() => setBranchSelected(e)}
                    >
                        <ListItemText primary={e.name} />
                    </ListItemButton>)}
                </List>}

                {type == 'selector' && <Autocomplete
                    disablePortal
                    disableClearable
                    options={branchList}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: '100%', zIndex:99999 }}
                    onChange={(event: any, newValue: { name: string, branchId: string } | null) => {
                        setBranchSelected(newValue as { name: string, branchId: string })
                    }}

                    renderInput={(params) => <TextField {...params} label={t('checking.titleBranch')} />}
                />}
            </DialogContent>
            <DialogActions>
                <SassButton
                    onClick={() => {

                        onOKAction(branchSelected as { name: string, branchId: string })
                        closeModal(CommonModalType.BRANCH_SELECTED)
                    }}
                    disabled={!branchSelected}
                    color="primary"
                    size='small'
                    variant="contained"

                >
                    {t('checking.selected')}
                </SassButton>
            </DialogActions>
        </Dialog>
    );
};

export default BranchSelectorModal