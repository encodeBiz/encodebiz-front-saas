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
  Box,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { useLayout } from '@/hooks/useLayout';
import { menuItemsServices, menuItemsGeneral, menuItemsHome } from '@/config/routes';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import EntitySwitcher from '../common/EntitySwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'nextjs-toploader/app';
import { useEntity } from '@/hooks/useEntity';
import logo from '../../../public/assets/images/encodebiz_logo.jpeg'
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
  const { user } = useAuth();
  const { currentEntity, entityServiceList } = useEntity();
   
  const { push } = useRouter();
  const { layoutState, changeLayoutState } = useLayout()
  const [openSubMenu, setOpenSubMenu] = useState<any>({
    products: false,
    reports: false,
    settings: false,
    ...menuItemsServices.reduce((acc: any, key: any) => {
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
              src={logo.src}
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
        <Box sx={{ p: 2, textAlign: 'center', mt: 4 }}>
          <EntitySwitcher />
        </Box>

        <Divider />

        {/* Main Menu */}
        <List>
          {/* Dashboard */}
          {menuItemsHome.map((item: any, i: number) => {
            if (item.divider) return <Divider key={i} />
            else
              return <ListItem key={i} disablePadding>
                <ListItemButton disabled={!currentEntity || item.header} onClick={() => push(item.link)} selected={pathname === item.link}>
                  {!item.header && <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>}
                  <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
                </ListItemButton>
              </ListItem>
          })}


          {menuItemsServices.map((item: any, i: number) => {
            if (item.divider) return <Divider key={i} />
            else
              if ((item.subMenu.length == 0 || !entityServiceList.find(e => e.id === item.id)?.isBillingActive || item.header))
                return <ListItem key={i} disablePadding>
                  <ListItemButton disabled={!currentEntity || item.header} onClick={() => push(item.link)} selected={pathname === item.link}>
                    {!item.header && <ListItemIcon> 
                      {item.icon}
                    </ListItemIcon>}
                    <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
                  </ListItemButton>
                </ListItem>

              else
                if (entityServiceList.map(e => e.id).includes(item.id)) {
                  return <div key={i} >
                    <ListItem disablePadding>
                      <ListItemButton disabled={!currentEntity} onClick={() => handleSubMenuToggle(item.id)}>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
                        {openSubMenu.products ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={openSubMenu[item.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subMenu.map((e: any, index: number) => <ListItem onClick={() => push(e.link)} key={i + '-' + index} disablePadding><ListItemButton sx={{ pl: 4 }}>
                          <ListItemIcon>
                            {e.icon}
                          </ListItemIcon>
                          <ListItemText primary={t(`layout.side.menu.${e.name}`)} />
                        </ListItemButton>
                        </ListItem>)}
                      </List>
                    </Collapse>
                  </div>
                } else return null
          })}

          {menuItemsGeneral.map((item: any, i: number) => {
            if (item.divider) return <Divider key={i} />
            else
              return <ListItem key={i} disablePadding>
                <ListItemButton disabled={!currentEntity || item.header} onClick={() => push(item.link)} selected={pathname === item.link}>
                  {!item.header && <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>}
                  <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
                </ListItemButton>
              </ListItem>
          })}

        </List>


      </Drawer>


    </Box>
  );
}