import { SxProps, Theme } from "@mui/material";

export const useStyles = (theme: Theme): Record<string, SxProps<Theme>> => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  header: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: {
      xs: 'column-reverse',
      sm: 'column-reverse',
      md: 'column-reverse',
      lg: 'row',
      xl: 'row',    }
  },
  content: {
    padding: theme.spacing(2),
  },
  fileItem: {
    position: 'relative',
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  selectedFile: {
    position: 'relative',
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.selected,
  },
  fileThumbnail: {
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
  },
  fileInfo: {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },
  fileActions: {
    display: 'flex',
    alignItems: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50%',
    color: theme.palette.primary.main,
  },
  footer: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

})
