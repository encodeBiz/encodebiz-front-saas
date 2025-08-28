import { CancelOutlined, SearchOutlined } from "@mui/icons-material";
import { TextField } from "@mui/material";
export interface TextFilterProps {
    value: any,
    label?: any,
    onChange: (value: any) => void,
}
export const TextFilter = ({ label, value, onChange }: TextFilterProps) => {
    return <TextField
        variant="outlined"
        placeholder={label}
        value={value}
        onChange={(e) => {
            onChange(e.target.value);
        }}
        sx={{ minWidth: 349, height: 56 }}
        slotProps={{
            input: {
                startAdornment: <SearchOutlined sx={{mr:1}} />,
                endAdornment: value ? <CancelOutlined onClick={() => onChange('')} /> : <></>,
            },
        }}

    />
}