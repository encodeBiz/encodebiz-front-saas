'use client';

import { PaletteOptions } from '@mui/material/styles';
import {
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Audiotrack as AudioIcon,
  Description as DocumentIcon} from '@mui/icons-material';

export const fileTypeIcons = {
  image: <ImageIcon />,
  video: <VideoIcon />,
  audio: <AudioIcon />,
  document: <DocumentIcon />,
  default: <FileIcon />,
};

export const lightTheme: PaletteOptions = {
  mode: 'light',
  // Light mode palette
  
  primary: {
    main: '#476BE7',
    light: '#DDE2F7',
    dark: '#001551',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#E9E8F5',
    light: '#DDE2F7',
    dark: '#E9E8F5',
    contrastText: '#000',
  },
  background: {
    default: '#F0EFFD',
    paper: '#fffBff',
  },
  text: {
    primary: '#1C1D1B',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: '#48494C',
  },
}



export const darkTheme: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#0054CA',
    light: '#e3f2fd',
    dark: '#42a5f5',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#ce93d8',
    light: '#f3e5f5',
    dark: '#ab47bc',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
}