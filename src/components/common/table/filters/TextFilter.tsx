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
        sx={{
           
            height: 46,
            '& .MuiOutlinedInput-root': {
                transition: 'width 0.3s ease',
                width: '200px',
                height:46,
                '&.Mui-focused': {
                    width: '300px',
                },
            },

        }}
        slotProps={{
            input: {
                startAdornment: <SearchOutlined sx={{ mr: 1 }} />,
                endAdornment: value ? <CancelOutlined onClick={() => onChange('')} /> : <></>,
            },
        }}

    />
}