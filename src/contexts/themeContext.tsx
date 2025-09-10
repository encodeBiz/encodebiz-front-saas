'use client'
import React, { createContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from '@/config/theme';

interface ThemeType {
    mode: 'light' | 'dark';
    changeColorMode: () => void;
}
/**
 * 
 * ({ theme }) => ({
          color: theme.palette.brand.main,
        }),
 */

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
                    MuiSvgIcon: {
                        defaultProps: {
                            // Set the color prop to your desired color
                            sx: {
                                color: mode === 'light' ? '#1C1B1D' : '#FFF'
                            }
                        },
                    },
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
                    MuiSelect: {
                        styleOverrides: {
                            icon: {
                                color: mode === 'light' ? '#1C1B1D' : '#FFF',
                                fontSize: '2rem',
                            },
                        },
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
                    },

                    MuiDrawer: {
                        styleOverrides: {
                            paper: () => ({
                                 borderRight: 'none',
                            }),
                        },
                    },
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
