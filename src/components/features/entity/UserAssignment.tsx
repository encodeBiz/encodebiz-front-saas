import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Autocomplete,
    Chip,
    Button,
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
    IconButton,
    Divider,
    CircularProgress,
    Card,
    useTheme
} from '@mui/material';
import { DeleteOutline, PersonAdd, PersonRemove } from '@mui/icons-material';
import IUser, { ICollaborator } from '@/domain/auth/IUser';
import { useTranslations } from 'next-intl';
import IUserEntity from '@/domain/auth/IUserEntity';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { BorderBox } from '@/components/common/tabs/BorderBox';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { TrashIcon } from '@/components/common/icons/TrashIcon';
import { CustomTypography } from '@/components/common/Text/CustomTypography';

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
    users: Array<ICollaborator>
    onAssign: ({
        userId,
        role,
        projectId
    }: {
        userId: string,
        role: string,
        projectId: string
    }) => void
    onRemove: ({
        userId,
        projectId
    }: {
        userId: string,
        projectId: string
    }) => void
    currentUser: IUser
    proccesing?: boolean
}
const UserAssignment = ({ project, users, onAssign, onRemove, currentUser, proccesing = false }: UserAssignmentProps) => {
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [selectedUser, setSelectedUser] = useState<ICollaborator | null>();
    const [selectedRole, setSelectedRole] = useState('write');
    const [filteredUsers, setFilteredUsers] = useState<Array<ICollaborator>>([]);
    const t = useTranslations()
    const { openModal, closeModal, open } = useCommonModal()
    const { user } = useAuth()
    const theme = useTheme()

    const { currentEntity } = useEntity()
    useEffect(() => {
        // Filter out users already assigned to the project
        const assignedUserIds = project.collaborators.map(c => c.user.id);
        const availableUsers = users.filter(user =>
            !assignedUserIds.includes(user.user.id) &&
            user.user.id !== currentUser.id
        );


        // Further filter by search input
        const filtered = availableUsers.filter(user =>
            user.user.fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.user.email.toLowerCase().includes(searchInput.toLowerCase())
        );

        setFilteredUsers(filtered);
    }, [users, project.collaborators, searchInput, currentUser]);

    const handleOpen = () => setOpenModalAdd(true);
    const handleClose = () => {
        setOpenModalAdd(false);
        setSearchInput('');
        setSelectedUser(null);
        closeModal()
    };

    const handleAssign = () => {
        if (selectedUser) {
            onAssign({
                userId: selectedUser.user.id as string,
                role: selectedRole,
                projectId: project.id
            });
            handleClose();
        }
    };

    const handleRemove = (userId: string) => {
        onRemove({
            userId,
            projectId: project.id
        });
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
                            <Card elevation={1} key={collaborator.user.id}>
                                <ListItem
                                    secondaryAction={
                                        currentEntity?.role !== 'owner' && collaborator.user.id !== user?.id && (
                                            <CustomIconBtn
                                                onClick={() => openModal(CommonModalType.DELETE, { data: collaborator.user.uid })}
                                                disabled={collaborator.user.uid === currentUser.id}
                                                icon={<TrashIcon />}
                                                color={theme.palette.primary.main}
                                            />
                                        )
                                    }
                                >



                                    <ListItemAvatar>
                                        <Avatar src={collaborator.user.photoURL as string} alt={collaborator.user.fullName} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={collaborator.user.fullName}
                                        secondary={
                                            t('core.label.' + collaborator.role)
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </Card>
                        ))}
                    </List>
                </BorderBox>
            </Paper>

            <Dialog open={openModalAdd} onClose={handleClose} fullWidth maxWidth="md" slotProps={{ paper: { sx: { p: 2, borderRadius: 4 } } }} >
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
                        <CustomTypography sx={{mb:2}}>{t('colaborators.invite')}</CustomTypography>
                        <Autocomplete
                            options={filteredUsers}
                            getOptionLabel={(option) => `${option.user.fullName} (${option.user.email})`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('core.label.email')}
                                    fullWidth
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Avatar src={option.user.phoneNumber} sx={{ width: 24, height: 24, mr: 1 }} />
                                    {option.user.fullName} ({option.user.email})
                                </Box>
                            )}
                            onChange={(event, newValue) => setSelectedUser(newValue)}
                            value={selectedUser}
                            isOptionEqualToValue={(option, value) => option.user.id === value.user.id}
                        />

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
                        disabled={!selectedUser}
                    >
                        {t('core.button.add')}
                    </SassButton>
                </DialogActions>
            </Dialog>


            {open.type === CommonModalType.DELETE && <ConfirmModal
                isLoading={proccesing}
                title={t('colaborators.deleteConfirmModalTitle')}
                description={t('colaborators.deleteConfirmModalTitle2')}
                onOKAction={(args: { data: any }) => handleRemove(args.data)}
            />}
        </Box>
    );
};

export default UserAssignment;