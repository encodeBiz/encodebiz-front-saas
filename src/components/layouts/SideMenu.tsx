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
  ExpandMore,
  Menu,
  MenuOpen
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { useLayout } from '@/hooks/useLayout';
import { menuItemsServices, menuItemsGeneral, menuItemsHome } from '@/config/routes';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';
import { useEntity } from '@/hooks/useEntity';
import logo from '../../../public/assets/images/logo.png'
const drawerWidth = 240;

const CustomListItemButton = ({ item, subItem = false }: { item: any, subItem?: boolean }) => {
  const pathname = usePathname()
  const t = useTranslations();
  const { currentEntity } = useEntity()
  const { push } = useRouter()
  return <ListItemButton
    sx={{
      '&.Mui-selected': {
        backgroundColor: (theme) => theme.palette.primary.main,
        borderRadius: 10,
        color: 'white',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      },
      // Styles for the hover state (when not selected)
      '&:hover': {
        backgroundColor: 'action.hover',
      },
      display: 'flex',
      justifyItems: 'flex-start',
      pl: subItem ? 4 : 2
    }}
    disabled={!currentEntity || item.header} onClick={() => push(item.link)} selected={pathname === item.link}>
    {!item.header && <ListItemIcon sx={{ minWidth: 30, color: pathname === item.link ? '#FFF' : 'inherit' }}>
      {item.icon}
    </ListItemIcon>}
    <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
  </ListItemButton>
}

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
  const t = useTranslations();
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
        <DrawerHeader >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', p: 2 }}>
            <Avatar
              sx={{ width: 190, height: 60, mr: 1 }}
              src={logo.src}
              alt="Company Logo"
            />

            <Divider
              sx={{
                width: '95%',
                margin: 'auto',
                marginBottom: 1
              }}
              orientation="horizontal" flexItem
            />
          </Box>


        </DrawerHeader>
        <Box display={'flex'} width={'100%'} alignItems={'flex-end'} justifyContent={'flex-end'}>
          <IconButton onClick={() => changeLayoutState({ ...layoutState, openDraw: false })}>
            {theme.direction === 'ltr' ? <MenuOpen /> : <Menu />}
          </IconButton>
        </Box>

        {/* Main Menu */}
        <List>
          {/* Dashboard */}
          {menuItemsHome.map((item: any, i: number) => {
            if (item.divider) return <Divider key={i} />
            else
              return <ListItem key={i} disablePadding>
                <CustomListItemButton item={item} />
              </ListItem>
          })}


          {menuItemsServices.map((item: any, i: number) => {
            if (item.divider) return <Divider key={i} />
            else
              if ((item.subMenu.length == 0 || !entityServiceList.find(e => e.id === item.id)?.isBillingActive || item.header))
                return <ListItem key={i} disablePadding>
                  <CustomListItemButton item={item} />
                </ListItem>

              else
                if (entityServiceList.map(e => e.id).includes(item.id)) {
                  return <div key={i} >
                    <ListItem disablePadding>
                      <ListItemButton disabled={!currentEntity} onClick={() => handleSubMenuToggle(item.id)}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={t(`layout.side.menu.${item.name}`)} />
                        {openSubMenu.products ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                    </ListItem>
                    <Collapse in={openSubMenu[item.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subMenu.map((e: any, index: number) => <ListItem onClick={() => push(e.link)} key={i + '-' + index} disablePadding>
                          <CustomListItemButton subItem item={e} />
                        </ListItem>)}
                      </List>
                    </Collapse>
                  </div>
                } else return null
          })}
          {currentEntity?.role === 'owner' && <>
            {menuItemsGeneral.map((item: any, i: number) => {
              if (item.divider) return <Divider key={i} />
              else
                return <ListItem key={i} disablePadding>
                  <CustomListItemButton item={item} />
                </ListItem>
            })}
          </>}
        </List>


      </Drawer>


    </Box>
  );
}