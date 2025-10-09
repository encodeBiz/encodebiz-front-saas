import { SxProps, Theme } from "@mui/material";

export const useStyles = (): Record<string, SxProps<Theme>> => ({
  root: {
    p: 1,
    mt: 8,
    mb: 8,
    borderRadius: 2,
    
  },
  containerTop: { textAlign: 'center', mb: 4 },
  fullWidth: { width: '100%' },
  locale:{
    position:{
      xs:'absolute',
      sm:'absolute',
      md:'absolute',
      xl:'absolute',
      lg:'absolute',
    },
    right:{
      xs:60,
      sm:60,
      md:140,
      xl:140,
      lg:140
    },
    top:{
      xs:10,
      sm:10,
      md:40,
      xl:40,
      lg:40
    },
    width:{
      xs:40,
      sm:40,
      md:40,
      xl:40,
      lg:40
    }
  }
})
