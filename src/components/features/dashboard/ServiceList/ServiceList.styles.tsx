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
    px: 4,
    textAlign: 'center',
    cursor: 'pointer'
  },
  iconContainer: {
    width: 112,
    height: 112,
    background: 'radial-gradient(circle at center, #001551 0, #002FB7 , #002FB7 100%)',
    borderRadius: '50%',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    color: '#FFF',
    fontSize: 40
  }
})
