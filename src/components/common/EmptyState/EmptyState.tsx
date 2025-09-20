import React from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    SvgIcon,
    styled
} from '@mui/material';
import {
    SearchOff as SearchEmptyIcon,
    FolderOff as FolderEmptyIcon,
    SentimentDissatisfied as NoResultsIcon,
    Add as AddIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    maxWidth: 600,
    margin: '0 auto'
}));

const IconContainer = styled(Box)(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    '& svg': {
        fontSize: 64
    }
}));

const EmptyState = ({
    title = '',
    description = '',
    icon = 'search',
    action,
    actionText = 'Add new item',
    onAction,
    onRefresh,
    showIcon = true,
    fullHeight = false,
    sx = {}
}: any) => {
    const t = useTranslations();


    const getIcon = () => {
        switch (icon) {
            case 'folder':
                return <FolderEmptyIcon />;
            case 'results':
                return <NoResultsIcon />;
            case 'search':
            default:
                return <SearchEmptyIcon />;
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: fullHeight ? '100vh' : 'auto',
                p: 2,
                ...sx
            }}
        >
            
            <StyledPaper elevation={0}>
                {showIcon && <IconContainer>
                    {typeof icon === 'string' ? (
                        getIcon()
                    ) : (
                        <SvgIcon component={icon} fontSize="large" />
                    )}
                </IconContainer>}

                <Typography variant="h6" >
                    {title ? title : t('core.feedback.empthy')}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, maxWidth: 400 }}
                >
                    {description ? description : t('core.feedback.empthytext')}
                </Typography>

                {(action || onAction || onRefresh) && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {onAction && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={onAction}
                            >
                                {actionText}
                            </Button>
                        )}

                        {onRefresh && (
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={onRefresh}
                            >
                                Refresh
                            </Button>
                        )}

                        {action && action}
                    </Box>
                )}
            </StyledPaper>
        </Box>
    );
};

export default EmptyState;