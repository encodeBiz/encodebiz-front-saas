import { Card, Paper, styled, SxProps, Theme } from "@mui/material";

export const useStyles = (theme:Theme): Record<string, SxProps<Theme>> => ({
  root: {
    margin: theme.spacing(1, 0),
  },
  card: {
    height: '100%',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[100],
  },
  list: {
    width: '100%',
    height: 300,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  divider: {
    margin: theme.spacing(1, 0),
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

