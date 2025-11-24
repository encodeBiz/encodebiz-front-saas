import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

 

export const CardIndicatorData = ({ icon, label, value }: { icon: ReactNode, label: string, value: any }) => <Box sx={{
    width: 221, minHeight: 67, borderRadius: 2, border: (theme) => '1px solid ' + theme.palette.primary.main
}} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={2} p={1} px={2} >
    <Box sx={{
        background: 'rgba(40, 81, 205, 0.1)',
        borderRadius: 2,
        width: 50,
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>{icon}</Box>
    <Box display={'flex'} flexDirection={'column'} width={'80%'}>
        <Typography color="#48494C0" fontSize={12} fontWeight={400}>{label}</Typography>
        <Typography variant="body1" fontWeight={500} sx={{ fontSize: 16 }}>{value}</Typography>
    </Box>
</Box>