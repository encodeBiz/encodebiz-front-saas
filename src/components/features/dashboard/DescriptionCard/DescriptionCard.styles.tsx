import { SxProps, Theme } from "@mui/material";


export const useStyles = (show: boolean): Record<string, SxProps<Theme>> => ({
  base: {
    width: '100%',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
    minHeight: 277,
    overflow: 'hidden',
    position: 'relative',
    p: 4,
    height: 277,
    background: () => 'transparent',
    borderRadius: 2,
    borderColor: '#001551',
    borderWidth:1,
    borderStyle:'solid',
    mt:10

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

  title: {
    fontWeight: 400,
    fontSize: 32,
    textAlign: 'left',

  },
  subtitle: {
    fontWeight: 400,
    fontSize: 16,
    textAlign: 'left'

  },
  imageContainer: {
    right: -10,
    top: -60,
    borderRadius: 1,
    position: 'absolute',
    zIndex: 10,
    transform: show ? 'translateX(0)' : 'translateX(60px)',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  }
})


