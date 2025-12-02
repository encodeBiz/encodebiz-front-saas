/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { CardContent, Typography, Box, List, ListItem, ListItemIcon, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
import usePricingCardController from './PricingCard.controller';
import { BizType } from '@/domain/core/IService';
import { useEntity } from '@/hooks/useEntity';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import SheetModalModal from '../modals/SheetModal';
import { SassButton } from '../buttons/GenericButton';
import { Cancel, CheckOutlined } from '@mui/icons-material';
import { useAppLocale } from '@/hooks/useAppLocale';
import ContactModalModal from '../modals/ContactModal/ContactModal';
import { useLayout } from '@/hooks/useLayout';
import { karla } from '@/config/fonts/google_fonts';


const PlanCard = styled(Box)<{ highlighted?: string, current?: string }>(({ theme, highlighted, current }) => ({
    maxWidth: 305,
    minWidth: 305,
    minHeight: 580,
    margin: theme.spacing(2),
    border: `1px solid ${current === 'true' ? '#4AB84F' : theme.palette.primary.main}`,
    transform: highlighted === 'true' ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    color: current === 'true' ? `${theme.palette.text.primary}` : highlighted === 'true' ? `${theme.palette.primary.contrastText}` : `${theme.palette.text.primary}`,
    borderRadius: 8,
    background: current === 'true' ? theme.palette.background.paper : highlighted === 'true' ? 'linear-gradient(23.64deg, #001551 31.23%, #002FB7 99.28%)' : 'transparent',
    boxShadow: current === 'true' ? '#4AB84F' : highlighted === 'true' ? '0px 6px 12px rgba(0, 65, 158, 0.25)' : 'none'

}));








export type PricingCardProps = IPlan & {
    fromService: BizType;

};

export const PricingCard: React.FC<PricingCardProps> = (props) => {
    const t = useTranslations();
    const { id, payPerUse, monthlyPrice, pricePerUse, description, name, highlighted = false, fromService, featuredList } = props;
    const { ubSubcribeAction, handleSubscripe } = usePricingCardController(id as string, name as string, fromService);
    const { navivateTo } = useLayout()
    const { currentLocale } = useAppLocale()
    const { open, closeModal } = useCommonModal()
    const { entitySuscription, currentEntity } = useEntity()
    const [items, setItems] = useState<Array<{ text: string, link: string }>>([])
    const [price] = useState(payPerUse ? t(pricePerUse) : t(monthlyPrice))




    useEffect(() => {
        const data: Array<{ text: string, link: string }> = []
        if (id !== 'fremium' && currentEntity?.entity.id) {
            if (!currentEntity.entity.legal?.legalName) data.push({ text: t('salesPlan.configureLegal'), link: '/entity?tab=company' })
            if (!currentEntity.entity.branding?.textColor && fromService !== 'checkinbiz') data.push({ text: t('salesPlan.configureBranding'), link: '/entity?tab=branding' })
            if (!currentEntity?.entity?.billingConfig || currentEntity?.entity?.billingConfig?.payment_method?.length === 0) data.push({ text: t('salesPlan.configureBilling'), link: '/entity?tab=billing' })
        }
        setItems(data)
    }, [currentEntity?.entity?.billingConfig, currentEntity?.entity?.billingConfig?.payment_method?.length, currentEntity?.entity.branding?.textColor, currentEntity?.entity.id, currentEntity?.entity.legal?.legalName, id, t])

    const current = entitySuscription.filter(e => e.plan === id && e.serviceId === fromService && e.status === 'active').length > 0
    return (<>
        <PlanCard highlighted={String(highlighted)} current={String(current)} >
            {current && <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{ fontSize: 22, color: '#FFF', background: '#4AB84F', width: '100%', height: 55, textAlign: 'center' }}>{t("salesPlan.contract")}</Box>}
            <CardContent sx={{ display: "flex", padding: 4, flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <Box>
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'flex-start'} pb={2}>
                        <Typography variant="h6" fontFamily={karla.style.fontFamily}>
                            {t(`salesPlan.${name}`) || name}
                        </Typography>
                        <Typography variant="body1">
                            {description ? (description as any)[currentLocale] : description['es']}
                        </Typography>
                    </Box>

                    <Divider sx={{ background: () => current ? '#4AB84F' : highlighted ? "#FFF" : '#002FB7' }} />

                    <Box py={2}>
                        {!current && <SassButton
                            sx={{ mb: 1 }}
                            fullWidth
                            variant="contained"
                            onClick={() => handleSubscripe(payPerUse)}
                            disabled={false}

                        >
                            {current ? t("salesPlan.contract") : t("salesPlan.pay")}
                        </SassButton>}

                        {price && name !== 'freemium' && <Typography
                            align='center'
                            variant="h6"                   >
                            {price}
                        </Typography>}

                    </Box>
                    {name !== 'freemium' && <Divider sx={{ background: () => current ? '#4AB84F' : highlighted ? "#FFF" : '#002FB7' }} />}
                    <List sx={{ marginTop: "10px" }}>
                        {((props as any)[`items_${currentLocale}`] as Array<string> ?? [])?.map((feature, i) => (
                            <ListItem key={i} disableGutters>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    {featuredList[i] ? <CheckOutlined fontSize="small" sx={{ color: (theme) => current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main }} /> : <Cancel fontSize="small" sx={{ color: (theme) => current ? theme.palette.text.primary : highlighted ? "#FFF" : theme.palette.primary.main }} />}
                                </ListItemIcon>
                                <Typography variant="body2">{feature}</Typography>
                            </ListItem>
                        ))}
                    </List>
                    {current && <SassButton
                        fullWidth
                        variant="outlined"
                        color='error'
                        onClick={() => {
                            if (current) {
                                ubSubcribeAction()
                            }
                        }}>
                        {t("salesPlan.del")}
                    </SassButton>}
                </Box>
            </CardContent>
        </PlanCard>
        {open.type === CommonModalType.BILLING && <SheetModalModal hideCancel
            title={t('salesPlan.imageConfirmModalTitle')}
            description={t('salesPlan.imageConfirmModalTitle2')}
            textPoint={items}
            textBtn={t('core.button.configurenow')}
            type={CommonModalType.BILLING}
            onOKAction={() => {
                closeModal(CommonModalType.BILLING)
                if (items.length > 0)
                    navivateTo(items[0].link)
                else
                    navivateTo(`/dashboard`)
            }}
        />}

        {open.type === CommonModalType.CONTACT && <ContactModalModal subject={t('contact.test2')} />}
    </>
    );
};

//Crop
//Crup de Staf
//Ajustar formulario de evento