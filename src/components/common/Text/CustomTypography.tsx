import { SxProps, Theme, Typography } from "@mui/material"

export interface CustomTypographyProps {
    size?: number,
    sx?: SxProps<Theme>,
    children: React.ReactNode
}

export const CustomTypography = ({ size = 24, sx = {}, children }: CustomTypographyProps) => <Typography variant='body1' sx={{ fontSize: size, fontWeight: 400, ...sx }}>{children}</Typography>

