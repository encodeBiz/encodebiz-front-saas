import React from 'react';
import { CardContent, Typography, Box, List, ListItem, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useTranslations } from 'next-intl';
import { GenericButton } from '../buttons/BaseButton';
import usePricingCardController from './RenuewCard.controller';
import { IEntitySuscription } from '@/domain/auth/ISubscription';
import { format_date } from '@/lib/common/Date';

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


const SelectButton = styled(GenericButton)<{ featured?: string }>(({ theme, featured }) => ({
    marginBottom: 0,
    width: '100%',
    color: featured === "true" ? theme.palette.text.primary : theme.palette.text.primary,
    backgroundColor: featured === "true" ? theme.palette.primary.contrastText : theme.palette.primary.main,
}));


export type PricingCardProps = {
    plan: IEntitySuscription
};

export const RenuewCard: React.FC<PricingCardProps> = ({ plan }) => {
    const t = useTranslations();
    const { renuewAction, loadingGetPlan } = usePricingCardController(plan);

 

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
                <SelectButton
                    featured={String(false)}
                    fullWidth
                    variant="contained"
                    onClick={() => {
                        renuewAction()
                    }}
                    disabled={loadingGetPlan}
                    loading={loadingGetPlan}
                >
                    {t("salesPlan.renew")}
                </SelectButton>
            </CardContent>
        </PlanCard>
    );
};