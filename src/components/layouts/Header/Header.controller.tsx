import { handleLogout } from "@/services/common/account.service";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import {
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon} from '@mui/icons-material';
import { useRouter } from "nextjs-toploader/app";

export const useHeader = () => {
  const t = useTranslations();
  const { push } = useRouter()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [showNotification, setShowNotification] = useState(0)
  const [showMessages, setShowMessages] = useState(0)

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };


  const contextMenu = [
    { label: t('layout.header.profile'), icon: <AccountCircleIcon fontSize="small" />, action: () => { push('/main/preferences/account'); handleMenuClose(); } },
   // { label: t('layout.header.setting'), icon: <SettingsIcon fontSize="small" />, action: () => { handleMenuClose(); } },
    { label: t('layout.header.logout'), icon: <LogoutIcon fontSize="small" />, action: () => { handleMenuClose(); handleLogout() } }
  ]

  return {
    anchorEl, handleMobileMenuClose, handleProfileMenuOpen, handleMobileMenuOpen,
    mobileMoreAnchorEl, handleMenuClose, contextMenu, showNotification, showMessages
  }
}