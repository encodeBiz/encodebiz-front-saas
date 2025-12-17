'use client';
import { karla } from '@/config/fonts/google_fonts';
import { Box, Container, Divider, Typography } from '@mui/material';

export default function TabContent({ title, subtitle, data, counter=false }: {counter?:boolean, title: string, subtitle?: string, data: Array<{ title: string, description: string }> }) {

    return (
        <Container maxWidth="xl">
            <Box sx={{ p: 3 }}>
                <Typography variant='h4' fontWeight={'500'}>{title}</Typography>
                {subtitle && <Typography variant='body1'>{subtitle}</Typography>}
            </Box>
            {data.map((e, i) => <Box key={i}>
                <Divider variant='fullWidth' />              
                <Box display={'flex'} flexDirection={{
                    xs: 'column',
                    sm: 'column',
                    md: 'column',
                    xl: 'row',
                    lg: 'row'
                }}
                    gap={4}
                    p={3}
                >
                    <Typography   sx={{ minWidth: 300, maxWidth: 300, textAlign: 'left', fontSize: 20, color: "#48494C"  }} fontFamily={karla.style.fontFamily }>
                     {counter?`${(i+1)}.`:''}   {e.title}
                    </Typography>
                    <Typography sx={{ fontSize: 18, color: "#48494C" }}>{e.description}</Typography>
                </Box>

            </Box>
            )}

        </Container>
    );
}
