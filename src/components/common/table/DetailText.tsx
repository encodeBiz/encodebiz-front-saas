import { HelpOutline } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";

export const DetailText = ({ label, value, orientation = 'column', children, help, valueFontSize=24 }: {valueFontSize?:number, help?: string, children?: React.ReactNode, label: string, value: any, orientation?: 'row' | 'column' }) => <Box display={'flex'} alignItems={orientation === 'row' ? 'center' : 'flex-start'} flexDirection={orientation} gap={orientation === 'column' ? 0 : 2} sx={{ mt: 1 }}>
    <Typography fontSize={16} color='#76777D' fontWeight={400} variant="subtitle1" >
        {label} {help && <Tooltip
            slotProps={{
                tooltip: {
                    sx: {
                        bgcolor: (theme)=>theme.palette.primary.main, // Dark green background
                        color:"#FFF", // White text color
                    },
                },
            }}
            title={help}>
            <HelpOutline style={{ fontSize: 20 }} /></Tooltip>}
    </Typography>
    <Typography fontSize={valueFontSize} color='#1C1B1D' fontWeight={400} variant="body2"   >
        {value}
    </Typography>

    {children}
</Box>


