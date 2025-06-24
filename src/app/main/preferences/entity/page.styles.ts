import { SxProps, Theme } from "@mui/material";

export const useStyles = (): Record<string, SxProps<Theme>> => ({
    container: {
        display: 'flex',
        flexDirection: {
            xs: 'row',
            sm: 'row',
            md: 'row',
            xl: 'column',
            lg: 'column',
        }
    }
})
