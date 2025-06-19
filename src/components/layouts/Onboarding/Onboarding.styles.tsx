import { SxProps, Theme } from "@mui/material";

export const useStyles = (): Record<string, SxProps<Theme>> => ({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyItems: 'center',
        justifyContent: 'center',
        p: 6
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: 10,
        objectFit: 'cover',
        mb: 6,
        boxShadow: 10
    }
})
