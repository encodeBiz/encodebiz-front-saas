import { Box, Typography } from "@mui/material"
 
export const PanelModalInfo = () => {
 
    return <Box display={'flex'} flexDirection={'column'}>
        <Typography sx={{ fontSize: 26 }}>Ayuda del Panel Comparativo</Typography>
        <br />
        <Typography sx={{ fontSize: 24 }}>Datos Operativos</Typography>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Horario operativo medio</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Horario habitual de inicio y fin según el comportamiento real de la sucursal. El sistema analiza las jornadas completas y obtiene un patrón horario estable.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Carga horaria semanal</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Cantidad de horas trabajadas por semana. Los valores se basan en la tendencia real del funcionamiento semanal.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Coste por hora trabajada</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Coste medio asociado a cada hora efectiva de actividad real.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Coste por jornada</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Coste aproximado de un día completo de actividad, según el comportamiento real de la sucursal.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Coste por rendimiento</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Medida estándar que resume la estabilidad y eficiencia de la jornada real. Permite comparar sucursales según cómo funcionan, independientemente de su actividad.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Rendimiento del coste invertido</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Mide cómo rinde el dinero invertido teniendo en cuenta patrón horario, regularidad y estabilidad. Un valor alto indica buen aprovechamiento operativo del coste.</Typography>
            </Box>


            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Nivel de confiabilidad</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Nivel de fiabilidad del patrón según cantidad y consistencia de los datos analizados.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Volumen de datos</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Número de jornadas laborales válidas utilizadas para construir la tendencia operativa.</Typography>
            </Box>

        </Box>

        <br />
        <Typography sx={{ fontSize: 24 }}>Datos de Actividad Temporal</Typography>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Promedio de inicio de jornada</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Hora media a la que suelen comenzar las jornadas laborales. Refleja el comportamiento habitual de inicio a lo largo del tiempo.</Typography>
            </Box>

            <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Promedio de fin de jornada</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Hora media a la que suelen terminar las jornadas laborales. Muestra la tendencia general del cierre de la jornada.</Typography>
            </Box>

             <Box display={'flex'} flexDirection={'column'}>
                <Typography sx={{ fontSize: 14 }} fontWeight={'bold'}>Horas trabajadas promedio</Typography>
                <Typography sx={{ fontSize: 14 }} color="textSecondary">Número medio de horas efectivas realizadas por jornada. Permite ver si la carga diaria de trabajo es estable o presenta variaciones.</Typography>
            </Box>
        </Box>
    </Box>
}

