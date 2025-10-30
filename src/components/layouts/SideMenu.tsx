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
  Box,
  IconButton
} from '@mui/material';
import {
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
import { useEntity } from '@/hooks/useEntity';
import logo from '../../../public/assets/images/logo.svg'
import Image from 'next/image';
const drawerWidth = 265;





const CustomListItemButton = ({ children, item, subItem = false, handleSubMenuToggle, disableHover = false }: { handleSubMenuToggle?: (menu: any) => void, item: any, disableHover?: boolean, subItem?: boolean, children?: any }) => {
  const pathname = usePathname()
  const t = useTranslations();
  const theme = useTheme();
  const { currentEntity } = useEntity()
  const { navivateTo } = useLayout()



  return <ListItemButton
    sx={{
      mx: 2,
      height: 56,
      '&.Mui-selected': {
        backgroundColor: (theme) => theme.palette.primary.main,
        borderRadius: 10,
        color: 'white',
        '&:hover': disableHover ? {} : {
          backgroundColor: 'primary.main',
          borderRadius: 10,
        },
      },

      '&.Mui-disabled': {
        opacity: 1,
        color: (theme) => theme.palette.text.disabled,

      },
      // Styles for the hover state (when not selected)
      '&:hover':  disableHover ? {} :{
        backgroundColor: 'action.hover',
        borderRadius: 10,
      },
      display: 'flex',
      justifyItems: 'flex-start',
      pl: subItem ? 4 : 2
    }}
    disabled={!currentEntity || item.header}
    onClick={() => {
      if (typeof handleSubMenuToggle === 'function' && item.id)
        handleSubMenuToggle(item.id)
      else {
        navivateTo(item.link, true)
      }
    }}
    selected={pathname.includes(item.link)}>
    {!item.header && item.icon && <ListItemIcon sx={{ minWidth: 30, color: pathname.includes(item.link) ? '#FFF' : theme.palette.text.primary }}>
      {item.icon}
    </ListItemIcon>}
    <ListItemText color={theme.palette.text.primary} primary={t(`layout.side.menu.${item.name}`)} />
    {children}
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
  const { currentEntity, entityServiceList } = useEntity();

  const { layoutState, changeLayoutState, navivateTo } = useLayout()
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
        <DrawerHeader sx={{ pt: 2, pb: 2, width: '100%' }} >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <Image
              width={220}
              height={73}
              src={logo}
              alt="Company Logo"
            />


          </Box>


        </DrawerHeader>
        <Box display={'flex'} width={'100%'} alignItems={'flex-end'} justifyContent={'flex-end'}>
          <IconButton onClick={() => changeLayoutState({ ...layoutState, openDraw: false })}>
            {theme.direction === 'ltr' ? <MenuOpen sx={{ color: '#1C1B1D' }} /> : <Menu sx={{ color: '#1C1B1D' }} />}
          </IconButton>
        </Box>

        {/* Main Menu */}
        <List>
          {/* Dashboard */}
          {menuItemsHome.map((item: any, i: number) => {
            if (item.divider) return null
            else
              return <ListItem key={i} disablePadding>
                <CustomListItemButton item={item} />
              </ListItem>
          })}


          {menuItemsServices.map((item: any, i: number) => {
            if (item.divider) return null
            else
              if ((item.subMenu.length == 0 || !entityServiceList.filter(e => e.active).find(e => e.id === item.id)?.isBillingActive || item.header))
                return <ListItem key={i} disablePadding>
                  <CustomListItemButton item={item} />
                </ListItem>

              else
                if (entityServiceList.filter(e => e.active).map(e => e.id).includes(item.id)) {
                  return <div key={i} >
                    <ListItem disablePadding>
                      <CustomListItemButton item={item} handleSubMenuToggle={handleSubMenuToggle} disableHover={true}>
                        {openSubMenu[item.id] ? <ExpandLess /> : <ExpandMore />}
                      </CustomListItemButton>
                    </ListItem>
                    <Collapse in={openSubMenu[item.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subMenu.map((e: any, index: number) => <ListItem onClick={() => navivateTo(e.link, true)} key={i + '-' + index} disablePadding>
                          <CustomListItemButton subItem item={e} />
                        </ListItem>)}
                      </List>
                    </Collapse>
                  </div>
                } else return null
          })}
          {currentEntity?.role === 'owner' && <>
            {menuItemsGeneral.map((item: any, i: number) => {
              if (item.divider) return null
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