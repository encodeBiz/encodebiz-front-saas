import { Chip } from "@mui/material";



const colorRepository: any = {
    "failed": '#F4AA32',
    "active": 'rgba(122, 223, 127, 0.65)',
    "revoked": 'rgba(177, 35, 33, 0.65)',
    "default": 'rgba(0, 84, 202, 0.08)',
}

export const CustomChip = ({ label, background = "default", ...props }: { label: string; background?: string; } & any) => {
    return (
        <Chip
            label={label}
            variant="outlined"

            sx={{
                background: colorRepository[background],
                borderColor: (theme) => background == "default" ? theme.palette.primary.main : colorRepository[background],
                px: 1, py: 2,
                width: 100,
                ...props.sx
            }}
            {...props}
        />
    );
}   