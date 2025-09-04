import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import usePricingCardController from './RenuewCard.controller';
import { IEntitySuscription } from '@/domain/auth/ISubscription';
import ConfirmModal from '../modals/ConfirmModal';
import { SassButton } from '../buttons/GenericButton';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useLayout } from '@/hooks/useLayout';

const PlanCard = styled(Box)<{ featured?: boolean }>(({ theme, featured }) => ({
    maxWidth: 305,
    minWidth: 305,
    minHeight: 380,
    margin: theme.spacing(2),

    color: featured ? `${theme.palette.primary.contrastText}` : `${theme.palette.text.primary}`,
    borderRadius: 8,
    background: featured ? 'linear-gradient(23.64deg, #001551 31.23%, #002FB7 99.28%)' : theme.palette.background.paper,
    padding: 20,
    //boxShadow: featured ? '0px 6px 12px rgba(0, 65, 158, 0.25)' : 'none'

}));


export type PricingCardProps = {
    plan: IEntitySuscription
};

export const RenuewCard: React.FC<PricingCardProps> = ({ plan }) => {
    const t = useTranslations();
    const { unSubcribeAction, loadingGetPlan, planInfo } = usePricingCardController(plan);
    const { navivateTo } = useLayout()
    const { currentLocale } = useAppLocale()


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
                        {planInfo?.description ? (planInfo?.description as any)[currentLocale] : ''}
                    </Typography>
                </Box>

                <Divider sx={{ background: "#FFF" }} />
                <Box py={2}>
                    <Typography
                        align='center'
                        variant="h5" >
                        {planInfo?.payPerUse ? planInfo?.pricePerUse : planInfo?.monthlyPrice}
                    </Typography>
                </Box>


                <Divider sx={{ background: "#FFF" }} />

                <SassButton
                    sx={{ mb: 1, mt: 4, height: 40 }}
                    fullWidth
                    variant="contained"
                    onClick={() => navivateTo(`/${plan.serviceId}/onboarding`)}
                    disabled={false}

                >
                    {t("renew.btn")}
                </SassButton>

                {/* <SassButton
                    sx={{ mb: 1 , height: 40}}
                    fullWidth
                    variant="contained"
                    color='error'
                    onClick={() => {
                        openModal(CommonModalType.DELETE)
                    }} disabled={false}

                >
                    {t("salesPlan.del")}
                </SassButton> */}



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