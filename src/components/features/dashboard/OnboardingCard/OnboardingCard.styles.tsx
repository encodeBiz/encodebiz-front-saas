import { SxProps, Theme } from "@mui/material";


export const useStyles = (show:boolean): Record<string, SxProps<Theme>> => ({
  base: {
    width: '100%',
    minHeight:237,
    display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
    background: 'linear-gradient(77.62deg, #001551 41.78%, #002FB7 98.81%)',
    boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.45)',
    borderRadius: 2,
    color: '#FFF',
    overflow: 'hidden',
    position: 'relative',
    p: 4

  },
  content: {
    pl: 8, pr: 8
  },
  root: {
    pl: 4, pr: 4, borderRadius: 2, display: 'flex', flexDirection: {
      xs: 'column-reverse',
      sm: 'column-reverse',
      md: 'column-reverse',
      lg: 'row',
      xl: 'row',

    }, alignItems: 'center', justifyContent: 'space-between'
  },
  rootSimple: {
    pl: 4, pr: 4, borderRadius: 2, display: 'flex', flexDirection: {
      xs: 'column-reverse',
      sm: 'column-reverse',
      md: 'column-reverse',
      lg: 'row',
      xl: 'row',

    }, alignItems: 'flex-start', justifyContent: 'flex-start'
  },
  container: {
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: {
      xs: '100%',
      sm: '100%',
      md: '100%',
      lg: '70%',
      xl: '70%',
    }
  },
  title: {
    fontWeight: 400,
    fontSize: 45,
    textAlign: 'left',
    zIndex: 10
  },
  subtitle: {
    fontWeight: 400,
    fontSize: 24,
    textAlign: 'left',
     zIndex: 10

  },
  imageContainer: {
    borderRadius: 1,
    position: 'absolute',
    zIndex: 0,
    transform: show ? 'translateX(0)' : 'translateX(60px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  }
})
