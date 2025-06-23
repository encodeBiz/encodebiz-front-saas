import React, { useState } from 'react';
import { CardContent, Typography, Box, List, ListItem, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl';
import { IPlan } from '@/domain/core/IPlan';
import { GenericButton } from '../buttons/BaseButton';

import { useEntity } from '@/hooks/useEntity';
import { useAuth } from '@/hooks/useAuth';
import { subscribeInSassProduct } from '@/services/common/subscription.service';
import usePricingCardController from './PricingCard.controller';
export interface ISubscription {
    entityId: string
    serviceId: "passinbiz" | "checkinbiz"
    planId: "freemium" | "bronze" | "enterprise";
}

const PlanCard = styled(Box)<{ featured?: string }>(({ theme, featured }) => ({
    maxWidth: 250,
    minWidth: 220,
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
    right: 65,
    fontSize: '0.75rem',
    fontWeight: 'bold',
}));

const SelectButton = styled(GenericButton)<{ featured?: string }>(({ theme, featured }) => ({
    marginBottom: 0,
    width: '100%',
    color: featured === "true" ? theme.palette.text.primary : theme.palette.text.primary,
    backgroundColor: featured === "true" ? theme.palette.primary.contrastText : theme.palette.primary.main,
}));


export type PricingCardProps = IPlan & {
    fromService: "passinbiz" | "checkinbiz";
};

export const PricingCard: React.FC<PricingCardProps> = ({ id, name, price, period, features, featured = false, fromService }) => {
    const t = useTranslations();
    const {subcribeAction, loadingGetPlan} = usePricingCardController(id, fromService)
    return (
        <PlanCard featured={String(featured)}>
            {featured && (
                <FeaturedBadge>Most Popular</FeaturedBadge>
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

                    <Typography
                        variant="h4"
                        color="primary"
                        sx={{ textAlign: "center", marginTop: "20px" }}
                    >
                        {price}
                        <Typography variant="body2" component="span">
                            {period}
                        </Typography>
                    </Typography>

                    <List sx={{ marginTop: "10px" }}>
                        {features.map((feature, i) => (
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
                    featured={String(featured)}
                    fullWidth
                    variant="contained"
                    onClick={subcribeAction}
                    disabled={loadingGetPlan}
                    loading={loadingGetPlan}
                >
                    {t("salesPlan.pay")}
                </SelectButton>
            </CardContent>
        </PlanCard>
    );
};