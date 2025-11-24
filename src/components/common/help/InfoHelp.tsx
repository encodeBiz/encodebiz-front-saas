import { Box, Typography } from "@mui/material"

export const InfoHelp = ({ title, data }: { title: string, data: Array<{ head: string, items: Array<{ id?: string, title: string, description: string }> }> }) => {
    return <Box display={'flex'} flexDirection={'column'}>
        <Typography sx={{ fontSize: 26 }}>{title}</Typography>
        <br />
        {data.map((items, i) => <Box key={i}>
            <Typography sx={{ fontSize: 24 }}>{items.head}</Typography>
            <Box display={'flex'} flexDirection={'column'} gap={2}>
                {items.items.map((item, j) => <Box key={j + '-' + i} display={'flex'} flexDirection={'column'}>
                    <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>{item.title}</Typography>
                    <Typography sx={{ fontSize: 14 }} color="textSecondary">{item.description}</Typography>
                </Box>)}
            </Box>
        </Box>)}
    </Box>

}

