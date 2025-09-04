import { SxProps, Theme } from "@mui/material";

export const useStyles = (): Record<string, SxProps<Theme>> => ({
  root: {
    p: 4,
    mt: 8,
    borderRadius: 2,
       bgcolor:(theme) => theme.palette.background.paper
  },
  containerTop: { textAlign: 'left', mb: 4 },
  fullWidth: { width: '100%' },
  locale:{
    position:{
      xs:'relative',
      sm:'relative',
      md:'absolute',
      xl:'absolute',
      lg:'absolute',
    },
    right:{
      xs:0,
      sm:0,
      md:140,
      xl:140,
      lg:140
    },
    top:{
      xs:20,
      sm:20,
      md:40,
      xl:40,
      lg:40
    },
    width:{
      xs:'100%',
      sm:'100%',
      md:40,
      xl:40,
      lg:40
    }
  }
})
