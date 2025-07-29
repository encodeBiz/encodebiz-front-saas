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
        flexDirection: 'row',
        justifyItems: 'center',
        justifyContent: 'center',
        alignItems:'center',
        p: 6
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        objectFit: 'cover',
        mb: 6,
        boxShadow: 10
    },
    textContent:{
        fontSize:30,
          display: 'flex',
        flexDirection: 'row',
        justifyItems: 'center',
        justifyContent: 'center',
        textAlign:'center'

    },
    footer:{
   display: 'flex',
        flexDirection: 'row',
        justifyItems: 'center',
        justifyContent: 'space-between',
        p:2,
        borderTop:'1px solid rgba(0, 0, 0, 0.12)',
        textAlign:'center'
    }
})
 