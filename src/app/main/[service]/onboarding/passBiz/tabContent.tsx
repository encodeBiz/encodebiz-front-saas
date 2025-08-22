'use client';
import { Box, Card, CardContent, Container, Divider, Typography } from '@mui/material';

export default function TabContent({ title, subtitle, data }: { title: string, subtitle?: string, data: Array<{ title: string, description: string }> }) {

    return (
        <Container maxWidth="xl">
            <Typography variant='h4' fontWeight={'500'}>{title}</Typography>
            {subtitle && <Typography variant='caption'>{subtitle}</Typography>}
            <Card elevation={1} sx={{ mb: 1, mt: 4 }}>
                <CardContent>
                    {data.map((e, i) => <Box key={i}> <Box display={'flex'} flexDirection={{
                        sx: 'column',
                        sm: 'column',
                        md: 'column',
                        xl: 'row',
                        lg: 'row'
                    }}
                        gap={4}
                        p={3}
                    >
                        <Typography variant='h6' sx={{ minWidth: 300, maxWidth: 300, textAlign: 'center' }}>{e.title}</Typography>
                        <Typography>{e.description}</Typography>
                    </Box>
                        {data.length - 1 !== i && <Divider />}
                    </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}
