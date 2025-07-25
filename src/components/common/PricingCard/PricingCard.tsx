import React, { useEffect } from 'react';
import { CardContent, Typography, Box, List, ListItem, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
import { GenericButton } from '../buttons/BaseButton';
import usePricingCardController from './PricingCard.controller';
import { BizType } from '@/domain/core/IService';
import { useEntity } from '@/hooks/useEntity';

const PlanCard = styled(Box)<{ featured?: string }>(({ theme, featured }) => ({
    maxWidth: 300,
    minWidth: 250,
    margin: theme.spacing(2),
    border: featured === "true" ? `1px solid ${theme.palette.primary.main}` : 'none',
    transform: featured === "true" ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    color: featured === "true" ? `${theme.palette.primary.contrastText}` : `${theme.palette.text.primary}`,
    borderRadius: 6,
    backgroundColor: featured === "true" ? theme.palette.primary.light : theme.palette.background.paper,
    paddingTop: 20,
}));

const FeaturedBadge = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    color: "black",
    padding: theme.spacing(0.5, 2),
    borderRadius: 20,
    position: 'absolute',
    border: `1px solid ${theme.palette.primary.main}`,
    top: -10,
    right: 94,
    fontSize: '0.75rem',
    fontWeight: 'bold',
}));

const SelectButton = styled(GenericButton)<{ featured?: string }>(({ theme, featured }) => ({
    marginBottom: 0,
    width: '100%',
    color: featured === "true" ? theme.palette.text.primary : theme.palette.text.primary,
    backgroundColor: featured === "true" ? theme.palette.primary.contrastText : theme.palette.primary.main,
}));

const DangerButton = styled(GenericButton)(({ theme }) => ({
    marginBottom: 0,
    width: '100%',
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.error.light,
}));


export type PricingCardProps = IPlan & {
    fromService: BizType; 
    isContract: boolean;
};

export const PricingCard: React.FC<PricingCardProps> = ({ id, name, price, period, isContract, features, featured = false, fromService }) => {
    const t = useTranslations();
    const { subcribeAction, loadingGetPlan, setLoadingGetPlan, ubSubcribeAction } = usePricingCardController(id as string, fromService);
    const { currentEntity } = useEntity();

    useEffect(() => {
        setLoadingGetPlan(!currentEntity || !currentEntity?.entity?.billingEmail || !currentEntity?.entity?.legal?.legalName || !currentEntity?.entity?.legal?.taxId || !currentEntity?.entity?.billinConfig?.payment_method);
    }, [currentEntity?.entity?.id]);

    return (
        <PlanCard featured={String(featured)}>
            {featured && (
                <FeaturedBadge>{t("salesPlan.popular")}</FeaturedBadge>
            )}

            <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <span>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        {name}
                    </Typography>

                    {price && <Typography
                        variant="h4"
                        color="primary"
                        sx={{ textAlign: "center", marginTop: "20px" }}
                    >
                        {price}
                        <Typography variant="body2" component="span">
                            {period}
                        </Typography>
                    </Typography>}

                    <List sx={{ marginTop: "10px" }}>
                        {(features as Array<string>).map((feature, i) => (
                            <ListItem key={i} disableGutters>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    <CheckCircleOutline color="primary" fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body2">{feature}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </span>
                <SelectButton
                    featured={String(isContract)}
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        if (!isContract) {
                            subcribeAction()
                        }
                    }}
                    disabled={loadingGetPlan}
                    loading={loadingGetPlan}
                >
                    {!isContract ? t("salesPlan.pay") : t("salesPlan.contract")}
                </SelectButton>

                {isContract && <DangerButton
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        if (isContract) {
                            ubSubcribeAction()
                        }
                    }}
                    disabled={loadingGetPlan}
                    loading={loadingGetPlan}
                >
                    {t("salesPlan.del")}
                </DangerButton>}
            </CardContent>
        </PlanCard>
    );
};