'use client';

import { Alert, Box, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  error?: Error | null;
  kpis?: { label: string; value: string }[];
  action?: ReactNode;
  children?: ReactNode;
}

export const StatCard = ({
  title,
  subtitle,
  isLoading = false,
  error,
  kpis,
  action,
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
        {action}
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
              {kpis.map((kpi) => (
                <Box key={kpi.label} display="flex" flexDirection="column">
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
