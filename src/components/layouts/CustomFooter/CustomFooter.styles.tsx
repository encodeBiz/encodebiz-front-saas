import { SxProps, Theme } from "@mui/material";

export const useStyles = (): Record<string, SxProps<Theme>> => ({
    general_content: {
        width: '100%',
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        padding: {
            xs: "20px 20px",
            lg: "20px 40px"
        },
        flexDirection: {
            xs: 'column',
            sm: 'row',
            md: 'row',
            lg: 'row',
            xl: 'row',
        },

    },
    links_content: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
})
