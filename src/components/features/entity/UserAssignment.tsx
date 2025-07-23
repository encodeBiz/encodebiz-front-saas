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
    CircularProgress
} from '@mui/material';
import { PersonAdd, Close, PersonRemove } from '@mui/icons-material';
import { User } from 'firebase/auth';
import IUser, { ICollaborator } from '@/domain/auth/IUser';
import { useTranslations } from 'next-intl';
import IUserEntity from '@/domain/auth/IUserEntity';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import ConfirmModal from '@/components/common/modals/ConfirmModal';

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
    const { openModal, open } = useCommonModal()
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
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                {t('colaborators.title')}
                {proccesing && <CircularProgress
                    variant={'indeterminate'}
                />}
            </Typography>

            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1">
                        {project.collaborators.length} {project.collaborators.length === 1 ?  t('colaborators.titles') :  t('colaborators.title')}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={handleOpen}
                    >
                        {t('colaborators.add')}
                    </Button>
                </Box>

                <List>
                    {project.collaborators.map((collaborator) => (
                        <React.Fragment key={collaborator.user.id}>
                            <ListItem
                                secondaryAction={
                                    collaborator.user.id !== project.owner.user.id && (
                                        <IconButton
                                            edge="end"
                                            aria-label="remove"
                                            onClick={() => openModal(CommonModalType.DELETE, { data: collaborator.user.uid })}
                                            disabled={collaborator.user.uid === currentUser.id}
                                        >
                                            <PersonRemove />
                                        </IconButton>
                                    )
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar src={collaborator.user.photoURL as string} alt={collaborator.user.fullName} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={collaborator.user.fullName}
                                    secondary={
                                        <>
                                            {collaborator.user.id !== project.owner.user.id && <Chip
                                                label={collaborator.role}
                                                size="small"
                                                color={
                                                    collaborator.role === 'admin' ? 'error' :
                                                        collaborator.role === 'maintain' ? 'warning' :
                                                            'default'
                                                }
                                                sx={{ mr: 1 }}
                                            />}
                                            {collaborator.user.id === project.owner.user.id && (
                                                <Chip label="Owner" size="small" color="primary" />
                                            )}
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>

            <Dialog open={openModalAdd} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{t('colaborators.add')}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Autocomplete
                            options={filteredUsers}
                            getOptionLabel={(option) => `${option.user.fullName} (${option.user.email})`}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('colaborators.search')}
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('colaborators.cancel')}</Button>
                    <Button
                        onClick={handleAssign}
                        variant="contained"
                        disabled={!selectedUser}
                    >
                        {t('core.button.add')}
                    </Button>
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