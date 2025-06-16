
export const useStyles = () => ({
  base: {
    width: '100%',
    borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-around',pt:4,pb:4
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
