import { HelpOutline } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";

export const DetailText = ({ label, value, orientation = 'column', children, help }: { help?: string, children?: React.ReactNode, label: string, value: any, orientation?: 'row' | 'column' }) => <Box display={'flex'} flexDirection={orientation} gap={orientation === 'column' ? 0 : 2} sx={{ mt: 2 }}>
    <Typography fontSize={16} color='#45474C' fontWeight={400} variant="subtitle1" gutterBottom >
        {label} {help && <Tooltip
            slotProps={{
                tooltip: {
                    sx: {
                        bgcolor: (theme)=>theme.palette.background.paper, // Dark green background
                        color: (theme)=>theme.palette.text.primary, // White text color
                    },
                },
            }}
            title={help}>
            <HelpOutline style={{ fontSize: 20 }} /></Tooltip>}
    </Typography>
    <Typography fontSize={24} color='#1C1B1D' fontWeight={400} variant="body2"   >
        {value}
    </Typography>

    {children}
</Box>


