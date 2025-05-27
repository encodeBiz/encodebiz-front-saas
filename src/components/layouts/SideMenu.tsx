'use client'
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Layers as LayersIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { useLayout } from '@/hooks/useLayout';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function SideMenu() {
  const theme = useTheme();
  const { layoutState, changeLayoutState } = useLayout()
  const [openSubMenu, setOpenSubMenu] = useState<any>({
    products: false,
    reports: false,
    settings: false
  });


  const handleSubMenuToggle = (menu: string) => {
    setOpenSubMenu({ ...openSubMenu, [menu]: !openSubMenu[menu] });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          marginTop:10,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={layoutState.openDraw}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 2 }}>
            <Avatar
              sx={{ width: 40, height: 40, mr: 1 }}
              src="/path/to/logo.png"
              alt="Company Logo"
            />
            <Typography variant="h6" noWrap component="div">
              Company Name
            </Typography>
          </Box>
          <IconButton onClick={() => changeLayoutState({ ...layoutState, openDraw: false })}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {/* User Profile Section */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            sx={{ width: 64, height: 64, mx: 'auto', mb: 1 }}
            src="/path/to/user.jpg"
          />
          <Typography variant="subtitle1">John Doe</Typography>
          <Typography variant="body2" color="text.secondary">Admin</Typography>
        </Box>

        <Divider />

        {/* Main Menu */}
        <List>
          {/* Dashboard */}
          <ListItem disablePadding>
            <ListItemButton selected>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          {/* Products with submenu */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleSubMenuToggle('products')}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Products" />
              {openSubMenu.products ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openSubMenu.products} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LayersIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="All Products" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LayersIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Categories" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <LayersIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Inventory" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Customers */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItemButton>
          </ListItem>

          {/* Reports with submenu */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleSubMenuToggle('reports')}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Reports" />
              {openSubMenu.reports ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openSubMenu.reports} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BarChartIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sales" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BarChartIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Revenue" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BarChartIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>

        <Divider />

        {/* Settings with submenu */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleSubMenuToggle('settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
              {openSubMenu.settings ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openSubMenu.settings} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Security" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      
    </Box>
  );
}