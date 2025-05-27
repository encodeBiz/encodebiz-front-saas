'use client';

import { PaletteOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

export const lightTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#9c27b0',
  },
}



export const darkTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: '#ce93d8',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
}