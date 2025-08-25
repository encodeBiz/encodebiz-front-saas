import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import usePricingCardController from './RenuewCard.controller';
import { IEntitySuscription } from '@/domain/auth/ISubscription';
import ConfirmModal from '../modals/ConfirmModal';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { SassButton } from '../buttons/GenericButton';
import { useRouter } from 'nextjs-toploader/app';
import { MAIN_ROUTE } from '@/config/routes';

const PlanCard = styled(Box)<{ featured?: boolean }>(({ theme, featured }) => ({
    maxWidth: 305,
    minWidth: 305,
    minHeight: 400,
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.primary.main}`,
    transform: featured ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    color: featured ? `${theme.palette.primary.contrastText}` : `${theme.palette.text.primary}`,
    borderRadius: 8,
    background: featured ? 'linear-gradient(23.64deg, #001551 31.23%, #002FB7 99.28%)' : theme.palette.background.paper,
    padding: 20,
    boxShadow: featured ? '0px 6px 12px rgba(0, 65, 158, 0.25)' : 'none'

}));


export type PricingCardProps = {
    plan: IEntitySuscription
};

export const RenuewCard: React.FC<PricingCardProps> = ({ plan }) => {
    const t = useTranslations();
    const { unSubcribeAction, loadingGetPlan } = usePricingCardController(plan);
    const { openModal } = useCommonModal()
    const { push } = useRouter()

    return (
        <PlanCard featured={true}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Typography textTransform={'capitalize'} variant="h4">
                    {plan.serviceId}
                </Typography>
            </Box>
            <Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} pb={2}>
                    <Typography variant="h6">
                        {t(`salesPlan.${plan.plan}`) || plan.plan}
                    </Typography>
                    <Typography variant="body1">
                        Ideal para microempresas o equipos pequeños.
                    </Typography>
                </Box>

                <Divider sx={{ background: "#FFF" }} />

                <Box py={2}>

                    <Typography variant="h4" >
                        €15/Mes
                    </Typography>
                    <Typography variant="body2" component="span">
                        108€ año.
                    </Typography>
                </Box>

                <Divider sx={{ background: "#FFF" }} />

                <SassButton
                    sx={{ mb: 1, mt: 2 }}
                    fullWidth
                    variant="contained"
                    onClick={() => push(`/${MAIN_ROUTE}/${plan.serviceId}/onboarding`)}
                    disabled={false}

                >
                    {t("renew.btn")}
                </SassButton>

                <SassButton
                    sx={{ mb: 1 }}
                    fullWidth
                    variant="contained"
                    color='error'
                    onClick={() => {
                        openModal(CommonModalType.DELETE)
                    }} disabled={false}

                >
                    {t("salesPlan.del")}
                </SassButton>



            </Box>

            <ConfirmModal
                isLoading={loadingGetPlan}
                title={t('renew.deleteConfirmModalTitle')}
                description={t('renew.deleteConfirmModalTitle2')}
                onOKAction={() => unSubcribeAction()}
            />
        </PlanCard>
    );
};