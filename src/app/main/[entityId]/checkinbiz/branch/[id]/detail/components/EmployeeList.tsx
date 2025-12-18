import { SassButton } from "@/components/common/buttons/GenericButton"
import { Add } from "@mui/icons-material"
import { Typography, Paper, Box } from "@mui/material"
import { useTranslations } from "next-intl"

export const EmployeeList = ({ children, addResponsabiltyItem }: { addResponsabiltyItem: () => void, children: React.ReactNode }) => {
    const t = useTranslations()

    return  <Paper elevation={0} sx={{ p: 3 }}>
            <Box display={'flex'} justifyContent={'space-between'} alignContent={'center'} mb={2}>
                <Typography variant="subtitle1" gutterBottom sx={{ textTransform: 'uppercase' }}>
                   
                </Typography>

                <SassButton
                    onClick={addResponsabiltyItem}
                    variant='contained'
                    startIcon={<Add />}
                >{t('sucursal.addEmployee')}</SassButton>
            </Box>
            {children}

        </Paper>
 

}