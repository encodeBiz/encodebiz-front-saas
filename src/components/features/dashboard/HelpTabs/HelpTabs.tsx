import React from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  useTheme
} from '@mui/material';
import {
  Cloud,
  Storage,
  Security
} from '@mui/icons-material';


const HelpTabs = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Custom tab component with icon and stacked text
  const CustomTab = (props: any) => (
    <Tab
      {...props}
      iconPosition="start"

      label={
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textTransform: 'none',
          textAlign: 'left'
        }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {props.maintext}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {props.subtext}
          </Typography>
        </Box>
      }
      sx={{
        minHeight: 72,
        padding: theme.spacing(1.5, 2),
       justifyContent: 'flex-start',
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
        }
      }}
    />
  );

  return (
    <Box  >
      <Typography variant="h4" component="h2" align="left" gutterBottom>
        Más información
      </Typography>
      <Paper elevation={0} sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        display: 'flex', flexDirection: {
          xs: 'column',   
          sm: 'column',     
          md: 'column',     
          lg: 'row',      
          xl: 'row',     

        }
      }}>
        <Tabs
          orientation='vertical'
          value={value}
          onChange={handleChange}
          aria-label="icon position tabs"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
            }
          }}
        >
          <CustomTab
            icon={<Cloud fontSize="small" />}
            maintext="¿Como empiezo?"
            subtext="Leer la documentación"
          />
          <CustomTab
            icon={<Storage fontSize="small" />}
            maintext="¿Cuanto me costará Encodebiz Sass?"
            subtext="Consultar los planes de cada producto"
          />
          <CustomTab
            icon={<Security fontSize="small" />}
            maintext="¿Como me puede ayudar Encodebiz Sass?"
            subtext="Ver el video "
          />
        </Tabs>

        {/* Tab content */}
        <Box sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderTop: 0, width:'100%' }}>
          {value === 0 && (<>        
            Contenido aqui!!!
          </>
          )}
          {value === 1 && (
            <Typography>
               Contenido aqui!!!
            </Typography>
          )}
          {value === 2 && (
            <Typography>
               Contenido aqui!!!
            </Typography>
          )}
        </Box>
      </Paper>


    </Box>
  );
};

export default HelpTabs;