import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { useField } from 'formik';
import { useStyles } from './TransferListField.styles.';
import { useTranslations } from 'next-intl';



function not(a: Array<{ value: string, label: string }>, b: Array<{ value: string, label: string }>) {
  return a.filter((value: { value: string, label: string }) => b.map(e => e.value).indexOf(value.value) === -1);
}

function intersection(a: Array<{ value: string, label: string }>, b: Array<{ value: string, label: string }>) {
  return a.filter((value: { value: string, label: string }) => b.map(e => e.value).indexOf(value.value) !== -1);
}
export interface ITransferListProps {
  name: string,
  leftTitle: string,
  rightTitle: string
  options: Array<{ value: string, label: string }>
}
const TransferList = ({ name, leftTitle, rightTitle, options }: ITransferListProps) => {
  const t = useTranslations()
  const theme = useTheme()
  const classes = useStyles(theme);
  const [field, meta, helpers] = useField(name);
  const [checked, setChecked] = React.useState<Array<{ value: string, label: string }>>([]);
  const [left, setLeft] = React.useState<Array<{ value: string, label: string }>>([...options]);
  const [right, setRight] = React.useState<Array<{ value: string, label: string }>>(field.value || []);
  const [leftChecked, setLeftChecked] = useState<Array<{ value: string, label: string }>>([])
  const [rightChecked, setRigthChecked] = useState<Array<{ value: string, label: string }>>([])

  const [loaded, setLoaded] = useState(false)



  React.useEffect(() => {
    setLeftChecked(intersection(checked, left))
    setRigthChecked(intersection(checked, right))
  }, [checked, checked.length, left, right]);


  React.useEffect(() => {
    if (!loaded && field.value && options.length > 0) {
     

      const rigthtItems = field.value.map((e: any) => ({ value: e, label: options.find(o => o.value === e)?.label || ' - ' }))
      setRight(rigthtItems);
      setLoaded(true)
      setLeft(options.filter(e => !rigthtItems.map((r: { value: any; }) => r.value).includes(e.value)));
    }

  }, [field.value, field?.value?.length, loaded, options, options.length]);


  React.useEffect(() => {
    helpers.setValue(right.map(e => e.value));
  }, [right, name, helpers]);



  const handleToggle = (value: { value: string, label: string }) => () => {
    const currentIndex = checked.map(e => e.value).indexOf(value.value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (title: string, items: Array<{ value: string, label: string }>) => (
    <Card sx={classes.card}>
      <Box sx={classes.cardHeader}>
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      <Divider />
      <CardContent>
        {items.length === 0 && <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>{t('core.table.nodata')}</Box>}
        <List dense sx={classes.list}>
          {items.map((item) => (
            <ListItem
              key={item.value}
              onClick={handleToggle(item)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.map(e => e.value).indexOf(item.value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': item.label }}
                />
              </ListItemIcon>
              <ListItemText id={item.value} primary={item.label} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <div className={classes.root as any}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 5 }}>
          {customList(leftTitle, left)}
        </Grid>
        <Grid size={{ xs: 2 }}>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              sx={classes.button}
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={classes.button}
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid size={{ xs: 5 }}>
          {customList(rightTitle, right)}
        </Grid>
      </Grid>
      {meta.touched && meta.error && (
        <Typography color="error" variant="body2">
          {meta.error}
        </Typography>
      )}
    </div>
  );
};

export default TransferList;