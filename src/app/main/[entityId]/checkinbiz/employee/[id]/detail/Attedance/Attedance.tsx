import { Paper } from "@mui/material"

export const Attedance = ({ children }: {   children: React.ReactNode }) => {
    return <Paper elevation={0} sx={{ p: 3 }}>
        
        {children}

    </Paper>

}
