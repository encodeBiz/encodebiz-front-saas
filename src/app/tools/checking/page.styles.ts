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
    marginBottom:4,
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
