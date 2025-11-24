export const operationData = (t: any) => {

    return [{
        head: "Datos Operativos",
        items: [{
            id: "stability",
            title: "Horario operativo medio",
            description: "Horario habitual de inicio y fin según el comportamiento real de la sucursal. El sistema analiza las jornadas completas y obtiene un patrón horario estable."
        }, {
            id: "weeklyHours",
            title: "Carga horaria semanal",
            description: "Cantidad de horas trabajadas por semana. Los valores se basan en la tendencia real del funcionamiento semanal."
        }, {
            id: "costHour",
            title: "Coste por hora trabajada",
            description: "Coste medio asociado a cada hora efectiva de actividad real."
        }, {
            id: "costCycle",
            title: "Coste por jornada",
            description: "Coste aproximado de un día completo de actividad, según el comportamiento real de la sucursal."
        }, {
            id: "costEffective",
            title: "Coste por rendimiento",
            description: "Medida estándar que resume la estabilidad y eficiencia de la jornada real. Permite comparar sucursales según cómo funcionan, independientemente de su actividad."
        }, {
            id: "costEfficiency",
            title: "Rendimiento del coste invertido",
            description: "Mide cómo rinde el dinero invertido teniendo en cuenta patrón horario, regularidad y estabilidad. Un valor alto indica buen aprovechamiento operativo del coste."
        }, {
            id: "confidence",
            title: "Nivel de confiabilidad",
            description: "Nivel de fiabilidad del patrón según cantidad y consistencia de los datos analizados."
        }, {
            id: "observations",
            title: "Volumen de datos",
            description: "Número de jornadas laborales válidas utilizadas para construir la tendencia operativa."
        }]
    },

    ]
}

export const tempActivityData = (t: any) => {

    return [{
        head: "Datos de Actividad Temporal",
        items: [{
            id: "",
            title: "Promedio de inicio de jornada",
            description: "Hora media a la que suelen comenzar las jornadas laborales. Refleja el comportamiento habitual de inicio a lo largo del tiempo."
        }, {
            id: "",
            title: "Promedio de fin de jornada",
            description: "Hora media a la que suelen terminar las jornadas laborales. Muestra la tendencia general del cierre de la jornada."
        }, {
            id: "",
            title: "Horas trabajadas promedio",
            description: "Número medio de horas efectivas realizadas por jornada. Permite ver si la carga diaria de trabajo es estable o presenta variaciones."
        }]
    },

    ]
}


export const descriptionTypeActivity = (t: any): any => ({
    "weeklyStartAvg": "Variación diaria de la hora promedio de inicio de la jornada.",
    "weeklyEndAvg": "Variación diaria de la hora promedio de fin de la jornada.",
    "weeklyWorkAvg": "Evolución diaria del total promedio de horas trabajadas.",
})