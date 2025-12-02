import { Card, Paper, styled, SxProps, Theme } from "@mui/material";

export const useStyles = (theme:Theme): Record<string, SxProps<Theme>> => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  scannerContainer: {
    width: '100%',
    maxWidth: 500,
    margin: theme.spacing(2, 0),
    position: 'relative',
  },
  resultContainer: {
    marginTop: theme.spacing(3),
    width: '100%',
    maxWidth: 500,
  },
  successIcon: {
    color: theme.palette.success.main,
    fontSize: 48,
  },
  errorIcon: {
    color: theme.palette.error.main,
    fontSize: 48,
  },
  preview: {
    width: '100%',
  },
})


export const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  margin: theme.spacing(2, 0),
  overflow: 'visible'
}));

export const ScannerContainer = styled(Paper)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: 4
});

export const PreviewContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: 300,
  backgroundColor: '#000'
});

