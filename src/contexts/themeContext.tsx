'use client'
import React, { createContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from '@/config/theme';

interface ThemeType {
    mode: 'light' | 'dark';
    changeColorMode: () => void;
}

 
export const ThemeContext = createContext<ThemeType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const changeColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(
        () =>
            createTheme({ 
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            ...lightTheme
                        }
                        : {
                            // Dark theme colors
                            ...darkTheme
                        }),
                },
                typography: {
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',


                },
                components: {
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
                                ...(mode === 'light') ? {
                                    background: '#FFFBFF',
                                    boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)'
                                } : {
                                     boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)'
                                }
                            }
                        }
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                ...(mode === 'light'
                                    ? {
                                        backgroundColor: '#FFFBFF',
                                        color: '#000',
                                    }
                                    : {
                                        backgroundColor: '#121212',
                                        color: '#ffffff',
                                    })
                            }
                        }
                    }
                }
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ changeColorMode, mode }}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
}
