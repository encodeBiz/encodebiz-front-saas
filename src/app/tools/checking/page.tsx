
'use client'
import React from 'react';
import {
    Box,
    Container
} from '@mui/material';
import Check from './Check/Check';
import { useTranslations } from 'next-intl';
import { NorthEastOutlined } from '@mui/icons-material';


const CheckingPage = () => {
    const t = useTranslations()

    return (
        <Container maxWidth="sm" sx={{backgroundColor:'#FFFFFF', height:'100vh', position:'relative', paddingBottom:10}}>
            {/** 
            <Box sx={classes.locale}>
                <LocaleSwitcher />
            </Box>
            */}
            <Check />

            <Box
                sx={{

                    position: 'absolute',
                    width: '100%',
                    height: 89,
                    left: 0,
                    bottom: 0,
                    /* E-SAAS/sys/light/on-primary-fixed */
                    background: '#001946',
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',
                    gap:1,
                    cursor:'pointer',    
                    color:'#FFFFFF',
                }}
            >
                {t('checking.history')}
                <NorthEastOutlined />
            </Box>
        </Container>
    );
};

export default CheckingPage;
