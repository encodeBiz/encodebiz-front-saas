import { SxProps, Theme } from "@mui/material";


export const useStyles = (): Record<string, SxProps<Theme>> => ({

  card: {
    width: '100%',
    height: '100%',
    maxWidth: {
      sx: '100%',
      sm: '100%',
      md: '100%',
      lg: 483,
      xl: 483,
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    p: 1,
    px: 2,
    textAlign: 'center',
    cursor: 'pointer'
  },
  
  iconContainer: {
    width: 112,
    height: 112,
    background: 'radial-gradient(86.25% 86.25% at 69.17% 5.83%, #001551 12.39%, #1953FA 48.37%, #0A2572 97.86%)',
    borderRadius: '50%',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: '#FFF',
    fontSize: 35
  },
  textContainer:{
    display:'flex',
    flexDirection:'column',
    gap:1,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    textAlign:'left',
    mt:2
  }
})
