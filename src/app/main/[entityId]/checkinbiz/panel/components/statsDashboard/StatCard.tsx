'use client';

import { Alert, Box, Card, CardContent, Skeleton, Stack, Typography, Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  kpis?: { label: string; value: string }[];
  action?: ReactNode;
  infoText?: ReactNode;
  children?: ReactNode;
}

export const StatCard = ({
  title,
  subtitle,
  isLoading = false,
  error,
  kpis,
  action,
  infoText,
  children,
}: StatCardProps) => (
  <Card sx={{ height: "100%", width: '100%' }}>
    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {infoText && (
            <Tooltip title={infoText} placement="left" arrow>
              <IconButton size="small" color="default">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {action}
        </Stack>
      </Box>
      {isLoading && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="25%" />
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        </Box>
      )}
      {!isLoading && error && <Alert severity="error">{error.message}</Alert>}
      {!isLoading && !error && (
        <>
          {kpis && kpis.length > 0 && (
            <Stack direction="row" spacing={3} rowGap={1.5} flexWrap="wrap">
              {kpis.map((kpi, idx) => (
                <Box key={`${kpi.label}-${idx}`} display="flex" flexDirection="column">
                  <Typography variant="body2" color="text.secondary">
                    {kpi.label}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {kpi.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
          {children}
        </>
      )}
    </CardContent>
  </Card>
);
