import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Card,
    useTheme
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import IUser, { ICollaborator } from '@/domain/auth/IUser';
import { useTranslations } from 'next-intl';
import IUserEntity from '@/domain/auth/IUserEntity';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { TrashIcon } from '@/components/common/icons/TrashIcon';
import { CustomTypography } from '@/components/common/Text/CustomTypography';
import { CustomChip } from '@/components/common/table/CustomChip';

const roleOptions = [
    { value: 'admin', label: 'Adminstrador' },
    { value: 'owner', label: 'Propietario' },
];
export interface EntityCollaboratorData {
    id: string
    owner: ICollaborator
    collaborators: Array<ICollaborator>
    data: Array<IUserEntity>
}
export interface UserAssignmentProps {
    project: EntityCollaboratorData
    onAssign: ({
        email,
        role,
        entityId
    }: {
        email: string,
        role: string,
        entityId: string
    }) => void
    onRemove: ({
        userId,
        entityId
    }: {
        userId: string,
        entityId: string
    }) => void
    currentUser: IUser
    proccesing?: boolean
}
const UserAssignment = ({ project, onAssign, onRemove, proccesing = false }: UserAssignmentProps) => {
    const [openModalAdd, setOpenModalAdd] = useState(false);

    const [email, setEmail] = useState<string>();
    const [selectedRole, setSelectedRole] = useState('write');
    const t = useTranslations()
    const { openModal, closeModal, open } = useCommonModal()
    const theme = useTheme()

    const handleOpen = () => setOpenModalAdd(true);
    const handleClose = () => {
        setOpenModalAdd(false);

        closeModal()
    };

    const handleAssign = () => {
        if (email) {
            onAssign({
                email: email as string,
                role: selectedRole,
                entityId: project.id
            });
            handleClose();
        }
    };

    const handleRemove = (userId: string) => {
        onRemove({
            userId,
            entityId: project.id
        });
        closeModal(CommonModalType.COLABORATOR)
    };

    return (
        <Box>
            <Paper elevation={0}>
                <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>

                    <SassButton
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={handleOpen}
                        size='small'
                        sx={{ height: 40 }}
                    >
                        {t('colaborators.add')}
                    </SassButton>
                </Box>
                <BorderBox sx={{ p: 2 }}>
                    <List>
                        {project.collaborators.map((collaborator) => (
                            <Card sx={{boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', mb:1}} elevation={0} key={collaborator.user.id}>

                                <ListItem
                                    secondaryAction={
                                        <Box display={'flex'}>

                                            {collaborator.status === 'invited' && <CustomChip
                                                id={collaborator.user.id}
                                                background={'gray'}
                                                text={'Estado de la invitación: Pendiente a aceptar'}
                                                size="small"
                                                label={'Estado de la invitación: Pendiente a aceptar'}

                                            />}
                                            {
                                                (collaborator.role === 'owner' && collaborator.status !== 'invited' && project.collaborators.filter(e => e.role === 'owner' && e.status === 'active').length > 1) && (
                                                    <CustomIconBtn
                                                        onClick={() => openModal(CommonModalType.COLABORATOR, { data: collaborator.user.uid })}
                                                         
                                                        icon={<TrashIcon />}
                                                        color={theme.palette.primary.main}
                                                    />
                                                )
                                            }
                                        </Box>

                                    }
                                >
                                    {collaborator.status !== 'invited' && <ListItemAvatar>
                                        <Avatar src={collaborator.user.photoURL as string} alt={collaborator.user.fullName} />
                                    </ListItemAvatar>}
                                    <ListItemText
                                        primary={collaborator.user.fullName === 'Guest' ? collaborator.user.email : collaborator.user.fullName}
                                        secondary={
                                            t('core.label.' + (collaborator.role))
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </Card>
                        ))}
                    </List>
                </BorderBox>
            </Paper>

            <Dialog open={openModalAdd} onClose={handleClose} fullWidth maxWidth="md" slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }} >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
                        <Typography variant='h5'>{t('colaborators.add')}</Typography>
                        <Typography variant='body1'>{t('colaborators.addText')}</Typography>
                    </Box>

                    <CustomIconBtn
                        onClick={handleClose}
                        color={theme.palette.primary.main}
                    />
                </DialogTitle>
                <DialogContent>
                    <BorderBox sx={{ mt: 2, p: 4 }}>
                        <CustomTypography sx={{ mb: 2 }}>{t('colaborators.invite')}</CustomTypography>

                        <FormControl fullWidth sx={{ mt: 3 }}>
                            <TextField
                                label={t('core.label.email')}
                                value={email ?? ``}
                                onChange={(e) => setEmail(e.target.value)} />

                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 3 }}>
                            <InputLabel id="role-select-label">{t('core.label.role')}</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={selectedRole}
                                label={t('core.label.role')}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                {roleOptions.map((role) => (
                                    <MenuItem key={role.value} value={role.value}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </BorderBox>
                </DialogContent>
                <DialogActions>

                    <SassButton
                        onClick={handleAssign}
                        variant="contained"
                        size='small'
                        disabled={!email || !selectedRole}
                    >
                        {t('core.button.add')}
                    </SassButton>
                </DialogActions>
            </Dialog>


            {open.type === CommonModalType.COLABORATOR && <ConfirmModal
                isLoading={proccesing}
                title={t('colaborators.deleteConfirmModalTitle')}
                description={t('colaborators.deleteConfirmModalTitle2')}
                onOKAction={(args: { data: any }) => handleRemove(args.data)}
            />}
        </Box>
    );
};

export default UserAssignment;