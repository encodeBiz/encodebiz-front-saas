import React, { ReactNode } from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';
import { useStyles } from './HeaderPage.styles';
export interface HeaderPageProps {
  title?: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
  isForm?: boolean
}

export default function HeaderPage({ children, title, description, isForm = false, actions }: HeaderPageProps) {
  const styles = useStyles()
  return (
    <Box  >
      <Paper elevation={0} sx={{ ...styles.base, background: (theme) => isForm ? theme.palette.background.paper : theme.palette.secondary.main }} >
        <Box sx={styles.rootSimple}>
          <Box pb={4} display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-start'} width={'100%'} >
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} alignItems={'flex-start'} width={'100%'} >
              <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 0, textAlign: 'left' }}>
                {title}
              </Typography>
              {description && <Typography variant="body1" align="center" gutterBottom sx={{  textAlign: 'left' }}>
                {description}
              </Typography>}
            </Box>
            {actions}
          </Box>
        </Box>
        <Box sx={styles.content}>
          {children}
        </Box>
      </Paper>

    </Box>
  );
}