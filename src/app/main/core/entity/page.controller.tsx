'use client'

import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import { ReactNode } from "react";


export type TabItem = {
    label: string | ReactNode;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    sx?: SxProps<Theme>;
};

export const useSettingEntityController = () => {
 return {}
}

