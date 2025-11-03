/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
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
    const [openDialog, setOpenDialog] = useState(false);
    const [selectOpen, setSelectOpen] = useState(false);
    const dialogRef = useRef(null);

    useEffect(() => {
        if (openDialog && dialogRef.current &&  type == 'selector') {
            const dialogPaper = (dialogRef.current as any).querySelector('.MuiDialog-paper');
            if (dialogPaper) {
                if (selectOpen) {
                    dialogPaper.style.minHeight = '400px';
                } else {
                    dialogPaper.style.minHeight = 'auto';
                }
            }
        }
    }, [selectOpen, openDialog]);
    return (
        <Dialog
            open={open.open}
            //onClose={() => closeModal(CommonModalType.EVENT_SELECTED)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            ref={dialogRef}
            maxWidth="sm"
            sx={{
                '& .MuiDialog-paper': {
                    transition: 'min-height 0.3s ease-in-out',
                    minHeight: selectOpen ? '400px' : 'auto',
                    maxHeight: selectOpen ? '80vh' : 'auto',
                    overflow: 'visible'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                    <CustomTypography >{t('checking.titleBranch')}</CustomTypography>
                </Box>
            </DialogTitle>
            <DialogContent >
                {type == 'item' && <List component="nav" aria-label="main mailbox folders">
                    {branchList.map((e, i) => <ListItemButton key={i}
                        selected={branchSelected?.branchId === e.branchId}
                        onClick={() => setBranchSelected(e)}
                    >
                        <ListItemText primary={e.name} />
                    </ListItemButton>)}
                </List>}

                {type == 'selector' && <Box sx={{ pt: 1 }}><Autocomplete
                    open={selectOpen}
                    onOpen={() => setSelectOpen(true)}
                    onClose={() => setSelectOpen(false)}
                    disablePortal
                    disableClearable
                    options={branchList}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: '100%', zIndex: 99999 }}
                    onChange={(event: any, newValue: { name: string, branchId: string } | null) => {
                        setBranchSelected(newValue as { name: string, branchId: string })
                    }}

                    renderInput={(params) => <TextField {...params} label={t('checking.titleBranch')} />}
                /></Box>}
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