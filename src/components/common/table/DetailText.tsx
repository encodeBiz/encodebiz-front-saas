import { Box, Typography } from "@mui/material";

export const DetailText = ({ label, value, orientation='column' }: { label: string, value: any, orientation?: 'row' | 'column' }) => <Box display={'flex'} flexDirection={orientation} sx={{ mt: 2 }}>
    <Typography fontSize={16} color='#45474C' fontWeight={400} variant="subtitle1" gutterBottom >
        {label}
    </Typography>
    <Typography fontSize={24} color='#1C1B1D' fontWeight={400} variant="body2"   >
        {value}
    </Typography>
</Box>


