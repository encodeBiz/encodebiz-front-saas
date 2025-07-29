import React from 'react';
import { CardContent, Typography, Box, List, ListItem, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl';
import { GenericButton } from '../buttons/BaseButton';
import usePricingCardController from './RenuewCard.controller';
import { IEntitySuscription } from '@/domain/auth/ISubscription';
import { format_date } from '@/lib/common/Date';
import ConfirmModal from '../modals/ConfirmModal';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';

const PlanCard = styled(Box)<{ featured?: string }>(({ theme, featured }) => ({
    maxWidth: 300,
    minWidth: 250,
    textTransform: 'capitalize',
    margin: theme.spacing(2),
    border: featured === "true" ? `1px solid ${theme.palette.primary.contrastText}` : 'none',
    transform: featured === "true" ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    color: featured === "true" ? `${theme.palette.primary.contrastText}` : `${theme.palette.text.primary}`,
    borderRadius: 6,
    backgroundColor: featured === "true" ? theme.palette.primary.light : theme.palette.background.default,
    paddingTop: 20,
}));


const DangerButton = styled(GenericButton)(({ theme }) => ({
    marginBottom: 0,
    width: '100%',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.light,
}));


export type PricingCardProps = {
    plan: IEntitySuscription
};

export const RenuewCard: React.FC<PricingCardProps> = ({ plan }) => {
    const t = useTranslations();
    const { ubSubcribeAction, loadingGetPlan } = usePricingCardController(plan);
    const { openModal, open } = useCommonModal()


    return (
        <PlanCard featured={String(false)}>

            <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <span>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        {plan.serviceId}
                    </Typography>

                    {plan.plan && <Typography
                        variant="h5"
                        color="primary"
                        sx={{ textAlign: "center", marginTop: "20px" }}
                    >
                        {plan.plan}

                    </Typography>}

                    <List sx={{ marginTop: "10px" }}>
                        <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleOutline color="primary" fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">Estado: {plan.status}</Typography>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleOutline color="primary" fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="body2">{format_date(plan.startDate)}</Typography>
                        </ListItem>
                    </List>
                </span>
                <DangerButton
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        openModal(CommonModalType.DELETE)
                    }}
                    disabled={loadingGetPlan}
                    loading={loadingGetPlan}
                >
                    {t("salesPlan.del")}
                </DangerButton>
            </CardContent>

            <ConfirmModal
                isLoading={loadingGetPlan}
                title={t('renew.deleteConfirmModalTitle')}
                description={t('renew.deleteConfirmModalTitle2')}
                onOKAction={(args: { data: Array<string> }) => ubSubcribeAction()}
            />
        </PlanCard>
    );
};