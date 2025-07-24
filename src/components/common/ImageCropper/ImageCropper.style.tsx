import { SxProps, Theme } from "@mui/material";

export const useStyles = (theme:Theme): Record<string, SxProps<Theme>> => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  uploadContainer: {
    width: '100%',
    maxWidth: 500,
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2),
    textAlign: 'center',
    border: `2px dashed ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  previewContainer: {
    width: '100%',
    maxWidth: 500,
    margin: theme.spacing(2, 0),
    position: 'relative',
  },
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
    background: '#f0f0f0',
    [theme.breakpoints.up('sm')]: {
      height: 400,
    },
  },
  controls: {
    padding: theme.spacing(2),
    width: '100%',
  },
  slider: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: 300,
    marginTop: theme.spacing(2),
  },
  dimensionInputs: {
    marginTop: theme.spacing(2),
    '& .MuiTextField-root': {
      marginRight: theme.spacing(2),
    },
  },
})