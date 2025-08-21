'use client';
import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Menu,
  Avatar,
  MenuItem,
  ListItemIcon,
  Tooltip,
  useTheme,
  Divider
} from '@mui/material';
import {
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  MenuOutlined,
  Bedtime,
  BrightnessHigh,
  MenuOpen, Menu as MenuIcon,
} from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/Help';
import { useLayout } from '@/hooks/useLayout';
import { useAppTheme } from '@/hooks/useTheme';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '../../common/LocaleSwitcher';
import { handleLogout } from '@/services/common/account.service';
import { useHeader } from './Header.controller';
import { useCommonModal } from '@/hooks/useCommonModal';
import { useAuth } from '@/hooks/useAuth';
import { useEntity } from '@/hooks/useEntity';
import EntitySwitcher from '@/components/common/EntitySwitcher';


export default function Header({ drawerWidth }: { drawerWidth: number }) {
  const { changeLayoutState, layoutState } = useLayout()
  const { user } = useAuth()
  const { changeColorMode } = useAppTheme()
  const theme = useTheme();
  const t = useTranslations();
  const { anchorEl, contextMenu, handleMobileMenuClose, handleProfileMenuOpen, handleMobileMenuOpen,
    mobileMoreAnchorEl, handleMenuClose, showNotification, showMessages } = useHeader()
  const { openModal } = useCommonModal()
  const { cleanEntityContext } = useEntity()
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{ mt: 6 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', p: 2 }}>
        <Avatar
          sx={{ width: 40, height: 40, mr: 1 }}
          src={user?.phoneNumber}
          alt={user?.fullName}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <Typography variant="body2" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            {user?.fullName}
          </Typography>
          <Typography variant="caption" noWrap component="div">
            {user?.email}
          </Typography>
        </Box>
      </Box>
      {contextMenu.map((e, i: number) => <MenuItem key={i} onClick={e.action}>
        <ListItemIcon>
          {e.icon}
        </ListItemIcon>
        {e.label}
      </MenuItem>)}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >

      <Box sx={{ p: 4 }}>
        <LocaleSwitcher />
      </Box>


      <MenuItem>
        <IconButton onClick={() => changeColorMode()} size="large" color="inherit">
          {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <p>{t('layout.header.theme')}</p>
      </MenuItem>

      {showMessages > 0 && <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={showMessages} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>{t('layout.header.messages')}</p>
      </MenuItem>}


      {showNotification > 0 && <MenuItem>
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge badgeContent={showNotification} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>{t('layout.header.notification')}</p>
      </MenuItem>}




      <MenuItem onClick={() => openModal()}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <HelpIcon />
        </IconButton>
        <p>{t('layout.header.help')}</p>
      </MenuItem>

      <MenuItem onClick={() => {
        handleMenuClose(); handleLogout(() => {
          cleanEntityContext()
        })
      }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <HelpIcon />
        </IconButton>
        <p>{t('layout.header.logout')}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, mb: 3 }}>
      <AppBar position="fixed" elevation={0} sx={{
        pl: { sm: `${layoutState.openDraw ? drawerWidth : 0}px` }, // For persistent drawe
        zIndex: (theme) => theme.zIndex.drawer - 1,
        bgcolor: (theme) => theme.palette.background.default,


      }}>
        <Toolbar>
          {!layoutState.openDraw && <IconButton onClick={() => changeLayoutState({ ...layoutState, openDraw: true })}>
            <MenuIcon />
          </IconButton>}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <EntitySwitcher />
          </Box>


          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <LocaleSwitcher />
            <IconButton
              onClick={() => changeColorMode()}
              sx={{
                mr: 1,
                ml: 1,
                mt: 1,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: (theme) => theme.palette.divider,
                borderRadius: 2,
                height: 40,
                width: 40
              }}
            >
              {theme.palette.mode === 'dark' ? <BrightnessHigh /> : <Bedtime />}
            </IconButton>




            <Tooltip title={t('layout.header.help')}>
              <IconButton
                size="large"
                sx={{
                  mr: 1,
                  mt: 1,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: (theme) => theme.palette.divider,
                  borderRadius: 2,
                  height: 40,
                  width: 40
                }}
                onClick={() => openModal()}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem />

            <Tooltip title={t('layout.header.profile')}>
              <IconButton
                edge="end"
                size="large"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={user?.photoURL ? user?.photoURL : ''}
                  alt={user?.displayName as string}
                />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuOutlined />
            </IconButton>
          </Box>

        </Toolbar>

        <Divider
          sx={{
            width: '95%',
            margin: 'auto',
            marginBottom: 1
          }}
          orientation="horizontal" flexItem
        />

      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}