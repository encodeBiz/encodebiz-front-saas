// GenericTabs.types.ts
import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

export type TabItem = {
  label: string | ReactNode;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

export type TabsOrientation = 'horizontal' | 'vertical';

export type GenericTabsProps = {
  tabs: TabItem[];
  orientation?: TabsOrientation;
  alignment?: 'left' | 'center' | 'right';
  color?: 'primary' | 'secondary';
  fullWidth?: boolean;
  scrollable?: boolean;
  defaultTab?: number;
  onChange?: (index: number) => void;
  sx?: SxProps<Theme>;
};