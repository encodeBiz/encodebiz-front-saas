import React from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  useTheme
} from '@mui/material';

export interface HelpTab {
  id: string,
  icon: (props: any) => React.ReactNode,
  title: string,
  description?: string,
  tabContent: React.ReactNode,
}

export interface HelpTabsProps {
  tabs: Array<HelpTab>
  ref?: any
}


const HelpTabs = ({ tabs, ref }: HelpTabsProps) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Custom tab component with icon and stacked text
  const CustomTab = (props: any) => (
    <Tab
      {...props}
      icon={props.icon(props)}
      iconPosition="start"
      label={
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textTransform: 'none',
          textAlign: 'left',

        }}>
          <Typography variant="h4" sx={{ fontWeight: 400, fontSize: 22, marginLeft:1 }}>
            {props.maintext}
          </Typography>
          {props.subtext && <Typography variant="body1" color="text.secondary">
            {props.subtext}
          </Typography>}
        </Box>
      }
      sx={{
        minHeight: 72,
        padding: theme.spacing(1.5, 2),
        justifyContent: 'flex-start',
        '&.Mui-selected': {
          backgroundColor: theme.palette.background.paper,
        },
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    />
  );




  return (

    <Paper ref={ref} elevation={0} sx={{
     boxShadow:'none',
      borderRadius: 1,
      marginTop: 10
    }}>
      <Tabs
        orientation='horizontal'
        value={value}
        variant='fullWidth'
        onChange={handleChange}
        aria-label="icon position tabs"
        sx={{
          '& .MuiTabs-indicator': {
            height: 3,
          }
        }}
      >
        {tabs.map((e, i) => <CustomTab key={i}
          icon={e.icon}
          maintext={e.title}
        />)}
      </Tabs>

      {/* Tab content */}
      <Box sx={{ borderTop: 0, width: '100%' }}>

        {tabs.map((e, i) => <span key={i}>
          {value === i && (<>
            {e.tabContent}
          </>)}
        </span>)}
      </Box>
    </Paper>

  );
};

export default HelpTabs;