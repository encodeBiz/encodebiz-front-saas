import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';



export const BorderBox = styled(({ ...props }: { children?: React.ReactNode, sx?: any }) => (
    <Box  {...props} sx={{ border: 2, borderColor: 'secondary.main', borderRadius: 2, ...props.sx }}>
        {props.children}
    </Box>
))({});
