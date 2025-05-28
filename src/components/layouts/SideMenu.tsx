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
import { menuItems } from '@/config/routes';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
  const pathname = usePathname()
  const t = useTranslations();
  
  const { layoutState, changeLayoutState } = useLayout()
  const [openSubMenu, setOpenSubMenu] = useState<any>({
    products: false,
    reports: false,
    settings: false,
    ...menuItems.reduce((acc: any, key: any) => {
      acc[key] = false;
      return acc;
    }, {})
  });


  const handleSubMenuToggle = (menu: string) => {
    setOpenSubMenu({ ...openSubMenu, [menu]: !openSubMenu[menu] });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          marginTop: 10,
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
          {menuItems.map((item: any, i: number) => {
            if (item.divider) return <Divider />
            else
              if (item.subMenu.length == 0)
                return <ListItem key={i} disablePadding>
                  <ListItemButton selected={pathname === item.link}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
                  </ListItemButton>
                </ListItem>

              else
                return <div key={i} >
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleSubMenuToggle(item.id)}>
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={t(`layout.side.menu.${item.name}`)}/>
                      {openSubMenu.products ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openSubMenu[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subMenu.map((e: any, index: number) => <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          {e.icon}
                        </ListItemIcon>
                        <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
                      </ListItemButton>)}

                    </List>
                  </Collapse>
                </div>
          })}

        </List>


      </Drawer>


    </Box>
  );
}