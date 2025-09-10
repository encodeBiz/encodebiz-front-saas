import { SxProps, Theme } from "@mui/material";

export const useStyles = (): Record<string, SxProps<Theme>> => ({
  base: {
    width: '100%',
    background: (theme) => theme.palette.background.paper,
    borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', pt: 4, pb: 0
  },
  content: {
    pl: 0, pr: 0,borderRadius:2,
    background: (theme) => theme.palette.background.paper,
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
  container: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  stack: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: {
      xs: 'center',
      sm: 'center',
      md: 'flex-start',
      lg: 'flex-start',
      xl: 'flex-start',
    },
    width: '100%',
    gap: 2,
    flexDirection: {
      xs: 'column',
      sm: 'column',
      md: 'column',
      lg: 'row',
      xl: 'row',

    }
  },
  imageContainer: { mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }
})
