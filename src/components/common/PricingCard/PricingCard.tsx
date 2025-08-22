import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Box, List, ListItem, ListItemIcon, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
import { BaseButton, GenericButton } from '../buttons/BaseButton';
import usePricingCardController from './PricingCard.controller';
import { BizType } from '@/domain/core/IService';
import { useEntity } from '@/hooks/useEntity';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useRouter } from 'nextjs-toploader/app';
import { useCommonModal } from '@/hooks/useCommonModal';
import SheetModalModal from '../modals/SheetModal';
import { SassButton } from '../buttons/GenericButton';
import { CheckOutlined } from '@mui/icons-material';

const PlanCard = styled(Box)<{ featured?: boolean }>(({ theme, featured }) => ({
    maxWidth: 305,
    minWidth: 305,
    minHeight: 580,
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.primary.main}`,
    transform: featured ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    color: featured ? `${theme.palette.primary.contrastText}` : `${theme.palette.text.primary}`,
    borderRadius: 8,
    background: featured ? 'linear-gradient(23.64deg, #001551 31.23%, #002FB7 99.28%)' : theme.palette.background.paper,
    padding: 20,
    boxShadow: '0px 6px 12px rgba(0, 65, 158, 0.25)'

}));





const DangerButton = styled(GenericButton)(({ theme }) => ({
    marginBottom: 0,
    width: '100%',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.light,
}));


export type PricingCardProps = IPlan & {
    fromService: BizType;

};

export const PricingCard: React.FC<PricingCardProps> = ({ id, name, priceMonth, priceYear, period, features, featured = false, fromService }) => {
    const t = useTranslations();
    const { ubSubcribeAction, handleSubscripe } = usePricingCardController(id as string, name as string, fromService);
    const { push } = useRouter()
    const { open, closeModal } = useCommonModal()
    const { entitySuscription, currentEntity } = useEntity()
    const [items, setItems] = useState<Array<string>>([])
    useEffect(() => {
        const data: Array<string> = []
        if (id !== 'fremium' && currentEntity?.entity.id) {
            if (!currentEntity.entity.legal?.legalName) data.push(t('salesPlan.configureLegal'))
            if (!currentEntity.entity.branding?.textColor) data.push(t('salesPlan.configureBranding'))
            if (!currentEntity?.entity?.billingConfig || currentEntity?.entity?.billingConfig?.payment_method?.length === 0) data.push(t('salesPlan.configureBilling'))
        }
        setItems(data)
    }, [currentEntity?.entity?.billingConfig, currentEntity?.entity?.billingConfig?.payment_method?.length, currentEntity?.entity.branding?.textColor, currentEntity?.entity.id, currentEntity?.entity.legal?.legalName, id, t])


    return (<>
        <PlanCard featured={featured}>

            <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <Box>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} pb={2}>
                        <Typography variant="h6">
                            {t(`salesPlan.${name}`) || name}
                        </Typography>
                        <Typography variant="body1">
                            Ideal para microempresas o equipos pequeños.
                        </Typography>
                    </Box>

                    <Divider sx={{ background: (theme) => featured ? "#FFF" : theme.palette.divider }} />

                    <Box py={2}>
                        <SassButton
                            sx={{ mb: 1 }}
                            fullWidth
                            variant="contained"
                            onClick={handleSubscripe}
                            disabled={false}

                        >
                            {entitySuscription.filter(e => e.plan === id && e.serviceId === fromService).length > 0 ? t("salesPlan.contract") : t("salesPlan.pay")}
                        </SassButton>
                        {priceMonth && <Typography
                            variant="h4"                   >
                            {priceMonth}
                        </Typography>}
                        {priceYear && <Typography variant="body2" component="span">
                            {priceYear}
                        </Typography>}
                    </Box>
                    <Divider sx={{ background: (theme) => featured ? "#FFF" : theme.palette.divider }} />


                    <List sx={{ marginTop: "10px" }}>
                        {(features as Array<string>).map((feature, i) => (
                            <ListItem key={i} disableGutters>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    <CheckOutlined fontSize="small" sx={{ color: (theme) => featured ? "#FFF" : theme.palette.primary.main }}  />
                                </ListItemIcon>
                                <Typography variant="body2">{feature}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>


                {entitySuscription.filter(e => e.plan === id && e.serviceId === fromService).length > 0 && <DangerButton
                    fullWidth
                    sx={{ mt: 1 }}
                    variant="contained"
                    onClick={() => {
                        if (entitySuscription.filter(e => e.plan === id && e.serviceId === fromService).length > 0) {
                            ubSubcribeAction()
                        }
                    }}>
                    {t("salesPlan.del")}
                </DangerButton>}
            </CardContent>
        </PlanCard>
        {open.type === CommonModalType.BILLING && <SheetModalModal
            title={t('salesPlan.imageConfirmModalTitle')}
            description={t('salesPlan.imageConfirmModalTitle2')}
            textPoint={items}
            textBtn={t('core.button.configurenow')}
            type={CommonModalType.BILLING}
            onOKAction={() => {
                closeModal(CommonModalType.BILLING)
                push(`/${MAIN_ROUTE}/${GENERAL_ROUTE}/entity`)
            }}
        />}
    </>
    );
};

//Crop
//Crup de Staf
//Ajustar formulario de evento