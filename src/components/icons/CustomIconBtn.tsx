import { CloseOutlined } from "@mui/icons-material"
import { IconButton, SxProps, Theme } from "@mui/material"
import { JSX } from "react"

export interface CustomIconBtnBtnProps {
    sx?: SxProps<Theme>,
    onClick: () => void,
    disabled?: boolean
    bgColor?: string
    color?: string
    icon?: JSX.Element
}

export const CustomIconBtn = ({ onClick, disabled = false, sx = {}, bgColor='rgba(0, 84, 202, 0.08)', color, icon = <CloseOutlined /> }: CustomIconBtnBtnProps) => <IconButton
    edge="end"
    aria-label="remove"
    onClick={onClick}
    disabled={disabled}
    sx={{
        ...sx,
        backgroundColor: bgColor,
        color,
        width: 44,
        height: 44,
        borderRadius: '50%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }}>
    {icon}
</IconButton>


 
