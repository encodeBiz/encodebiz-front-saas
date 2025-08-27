import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Box, List, ListItem, ListItemIcon, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
import usePricingCardController from './PricingCard.controller';
import { BizType } from '@/domain/core/IService';
import { useEntity } from '@/hooks/useEntity';
import { MAIN_ROUTE, GENERAL_ROUTE } from '@/config/routes';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useRouter } from 'nextjs-toploader/app';
import { useCommonModal } from '@/hooks/useCommonModal';
import SheetModalModal from '../modals/SheetModal';
import { SassButton } from '../buttons/GenericButton';
import { Cancel, CheckOutlined } from '@mui/icons-material';

const PlanCard = styled(Box)<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
    maxWidth: 305,
    minWidth: 305,
    minHeight: 580,
    margin: theme.spacing(2),
    border: `1px solid ${theme.palette.primary.main}`,
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    color: highlighted ? `${theme.palette.primary.contrastText}` : `${theme.palette.text.primary}`,
    borderRadius: 8,
    background: highlighted ? 'linear-gradient(23.64deg, #001551 31.23%, #002FB7 99.28%)' : theme.palette.background.paper,
    padding: 20,
    boxShadow: highlighted ? '0px 6px 12px rgba(0, 65, 158, 0.25)' : 'none'

}));








export type PricingCardProps = IPlan & {
    fromService: BizType;

};

export const PricingCard: React.FC<PricingCardProps> = ({ id, payPerUse, monthlyPrice, pricePerUse, description, name, maxHolders, features, highlighted = false, fromService, featuredList }) => {
    const t = useTranslations();
    const { ubSubcribeAction, handleSubscripe } = usePricingCardController(id as string, name as string, fromService);
    const { push } = useRouter()
    const { open, closeModal } = useCommonModal()
    const { entitySuscription, currentEntity } = useEntity()
    const [items, setItems] = useState<Array<string>>([])
    const [suscribed] = useState(entitySuscription.filter(e => e.plan === id && e.serviceId === fromService).length > 0)
    const [price] = useState(payPerUse ? pricePerUse : monthlyPrice)

     

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
        <PlanCard highlighted={highlighted}>
            <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <Box>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} pb={2}>
                        <Typography variant="h6">
                            {t(`salesPlan.${name}`) || name}
                        </Typography>
                        <Typography variant="body1">
                            {description}
                        </Typography>
                    </Box>

                    <Divider sx={{ background: (theme) => highlighted ? "#FFF" : theme.palette.divider }} />

                    <Box py={2}>
                        <SassButton
                            sx={{ mb: 1 }}
                            fullWidth
                            variant="contained"
                            onClick={handleSubscripe}
                            disabled={false}

                        >
                            {suscribed ? t("salesPlan.contract") : t("salesPlan.pay")}
                        </SassButton>
                        {price && <Typography
                            align='center'
                            variant="h6"                   >
                            {price}
                        </Typography>}

                    </Box>
                    <Divider sx={{ background: (theme) => highlighted ? "#FFF" : theme.palette.divider }} />


                    <List sx={{ marginTop: "10px" }}>
                        {(features as Array<string> ?? [])?.map((feature, i) => (
                            <ListItem key={i} disableGutters>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    {featuredList[i] ? <CheckOutlined fontSize="small" sx={{ color: (theme) => highlighted ? "#FFF" : theme.palette.primary.main }} /> : <Cancel fontSize="small" sx={{ color: (theme) => highlighted ? "#FFF" : theme.palette.primary.main }} />}
                                </ListItemIcon>
                                <Typography variant="body2">{feature}{feature == 'Limite de emisiones:' && (maxHolders ?? 'Sin límite')}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>


                {entitySuscription.filter(e => e.plan === id && e.serviceId === fromService).length > 0 && <SassButton
                    fullWidth
                    sx={{ mt: 1 }}
                    variant="contained"
                    color='error'
                    onClick={() => {
                        if (entitySuscription.filter(e => e.plan === id && e.serviceId === fromService).length > 0) {
                            ubSubcribeAction()
                        }
                    }}>
                    {t("salesPlan.del")}
                </SassButton>}
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