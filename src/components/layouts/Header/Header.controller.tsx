import { handleLogout } from "@/services/common/account.service";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import {
  AccountCircle as AccountCircleIcon,
   Logout as LogoutIcon} from '@mui/icons-material';
import { useRouter } from "nextjs-toploader/app";
import { MAIN_ROUTE, USER_ROUTE } from "@/config/routes";
import { useEntity } from "@/hooks/useEntity";

export const useHeader = () => {
  const t = useTranslations();
  const { push } = useRouter()
  const { cleanEntityContext } = useEntity()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [showNotification] = useState(0)
  const [showMessages] = useState(0)

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
    { label: t('layout.header.profile'), icon: <AccountCircleIcon fontSize="small" />, action: () => { navivateTo(`/${USER_ROUTE}/account`); handleMenuClose(); } },
    { label: t('layout.header.logout'), icon: <LogoutIcon fontSize="small" />, action: () => { 
      handleMenuClose(); 
      handleLogout(()=>{
        cleanEntityContext()
      })
     } }
  ]

  return {
    anchorEl, handleMobileMenuClose, handleProfileMenuOpen, handleMobileMenuOpen,
    mobileMoreAnchorEl, handleMenuClose, contextMenu, showNotification, showMessages
  }
}