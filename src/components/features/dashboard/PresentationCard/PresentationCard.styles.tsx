
export const useStyles = () => ({
  base: {
    width: '100%',
    mt: 4, mb: 4, pb: 4, borderRadius: 2, display: 'flex', flexDirection: 'column'
  },
  root: {
    mt: 4, mb: 4, pb: 4,p:4,pl:10,pr:10, borderRadius: 2, display: 'flex', flexDirection: {
      xs: 'column-reverse',
      sm: 'column-reverse',
      md: 'column-reverse',
      lg: 'row',
      xl: 'row',

    }, alignItems: 'center', justifyContent: 'space-around'
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
