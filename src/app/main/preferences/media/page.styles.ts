import { SxProps, Theme } from "@mui/material";

export const useStyles = (theme:Theme): Record<string, SxProps<Theme>> => ({
    container: {
        display: 'flex',
        flexDirection: {
            xs: 'row',
            sm: 'row',
            md: 'row',
            xl: 'column',
            lg: 'column',
        }
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
})
