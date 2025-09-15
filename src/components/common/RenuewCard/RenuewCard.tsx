import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import usePricingCardController from './RenuewCard.controller';
import { IEntitySuscription } from '@/domain/core/auth/ISubscription';
import { SassButton } from '../buttons/GenericButton';
import { useAppLocale } from '@/hooks/useAppLocale';
import { useLayout } from '@/hooks/useLayout';
import { karla } from '@/config/fonts/google_fonts';

const PlanCard = styled(Box)<{ featured?: string }>(({ theme }) => ({
    maxWidth: 305,
    minWidth: 305,
    minHeight: 380,
    margin: theme.spacing(2),
    color: theme.palette.text.primary,
    borderRadius: 8,
    background: '#E5EAFA',
    padding: 20,
    //boxShadow: featured ? '0px 6px 12px rgba(0, 65, 158, 0.25)' : 'none'

}));


export type PricingCardProps = {
    plan: IEntitySuscription
};

export const RenuewCard: React.FC<PricingCardProps> = ({ plan }) => {
    const t = useTranslations();
    const { planInfo } = usePricingCardController(plan);
    const { navivateTo } = useLayout()
    const { currentLocale } = useAppLocale()

    const text: any = {
        passinbiz: "PassBiz",
        passbiz: "PassBiz",
        checkbiz: "CheckBiz",
        checkinbiz: "CheckBiz",
    }

    return (
        <PlanCard>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Typography textTransform={'capitalize'} variant="h4" sx={{ color: (theme) => theme.palette.primary.main }}>
                    {text[plan.serviceId] ?? plan.serviceId}
                </Typography>
            </Box>
            <Box>
                <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} pb={2}>
                    <Typography variant="h6" fontFamily={karla.style.fontFamily}>
                        {t(`salesPlan.${plan.plan}`) || plan.plan}
                    </Typography>
                    <Typography variant="body1">
                        {planInfo?.description ? (planInfo?.description as any)[currentLocale] : ''}
                    </Typography>
                </Box>

                <Divider sx={{ background: (theme) => theme.palette.text.primary }} />
                <Box py={2}>
                    <Typography
                        align='center'
                        variant="h5" >
                        {planInfo?.payPerUse ? planInfo?.pricePerUse : planInfo?.monthlyPrice}
                    </Typography>
                </Box>


                <Divider sx={{ background: (theme) => theme.palette.text.primary }} />

                <SassButton
                    sx={{ mb: 1, mt: 4, height: 40 }}
                    fullWidth
                    variant="contained"
                    onClick={() => navivateTo(`/${plan.serviceId}/onboarding?to=plans`)}
                    disabled={false}
                >
                    {t("renew.btn")}
                </SassButton>     
            </Box>          
        </PlanCard>
    );
};