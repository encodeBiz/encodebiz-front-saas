import { Box, Typography } from "@mui/material"

const splitDescription = (desc: string) => {
    const parts = desc.split(/(Qué indica:|Cómo se obtiene:|Qué compara:|Qué evalúa:|Qué representa:|Por qué es confiable:|What it indicates:|How it is obtained:|What it compares:|What it evaluates:|What it represents:|Why it is reliable:)/);
    const items: Array<{ label: string, text: string }> = []
    for (let i = 0; i < parts.length; i++) {
        const label = parts[i]
        if (!label) continue
        if (label.endsWith(':')) {
            const text = (parts[i + 1] ?? '').trim()
            items.push({ label: label.replace(':', ''), text })
            i++
        }
    }
    return items.length > 0 ? items : null
}

export const InfoHelp = ({ title, data }: { title: string, data: Array<{ head: string, items: Array<{ id?: string, title: string, description: string }> }> }) => {
    return <Box display={'flex'} flexDirection={'column'}>
        <Typography sx={{ fontSize: 26 }}>{title}</Typography>
        <br />
        {data.map((items, i) => <Box key={i}>
            <Typography sx={{ fontSize: 24 }}>{items.head}</Typography>
            <Box display={'flex'} flexDirection={'column'} gap={2}>
                {items.items.map((item, j) => {
                    const structured = splitDescription(item.description)
                    return <Box key={j + '-' + i} display={'flex'} flexDirection={'column'} gap={0.5}>
                        <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>{item.title}</Typography>
                        {!structured && <Typography sx={{ fontSize: 14 }} color="textSecondary">{item.description}</Typography>}
                        {structured && structured.map((d, k) => (
                            <Box key={k} display="flex" flexDirection="row" gap={0.5}>
                                <Typography sx={{ fontSize: 13 }} fontWeight={600}>{d.label}:</Typography>
                                <Typography sx={{ fontSize: 13 }} color="textSecondary">{d.text}</Typography>
                            </Box>
                        ))}
                    </Box>
                })}
            </Box>
        </Box>)}
    </Box>

}
