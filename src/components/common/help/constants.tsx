export const operationData = (t: any) => {
    return [{
        head: t('employeeDashboard.operationalDataHead'),
        items: [{
            id: "stability",
            title: t('employeeDashboard.stability'),
            description: t('employeeDashboard.stabilityDesc')
        }, {
            id: "weeklyHours",
            title: t('employeeDashboard.weeklyHours'),
            description: t('employeeDashboard.weeklyHoursDesc')
        }, {
            id: "costHour",
            title: t('employeeDashboard.costHour'),
            description: t('employeeDashboard.costHourDesc')
        }, {
            id: "costCycle",
            title: t('employeeDashboard.costCycle'),
            description: t('employeeDashboard.costCycleDesc')
        }, {
            id: "costEffective",
            title: t('employeeDashboard.costEffective'),
            description: t('employeeDashboard.costEffectiveDesc')
        }, {
            id: "costEfficiency",
            title: t('employeeDashboard.costEfficiency'),
            description: t('employeeDashboard.costEfficiencyDesc')
        }, {
            id: "confidence",
            title: t('employeeDashboard.confidence'),
            description: t('employeeDashboard.confidenceDesc')
        }, {
            id: "observations",
            title: t('employeeDashboard.observations'),
            description: t('employeeDashboard.observationsDesc')
        }]
    }]
}

export const operationDataEmployee = (t: any) => {
    return [{
        head: t('employeeDashboard.operationalDataHead'),
        items: [{
            id: "stability",
            title: t('employeeDashboard.stability'),
            description: t('employeeDashboard.stabilityDesc')
        }, {
            id: "weeklyHours",
            title: t('employeeDashboard.hourDispersion'),
            description: t('employeeDashboard.hourDispersionDesc')
        }, {
            id: "costHour",
            title: t('employeeDashboard.costHour'),
            description: t('employeeDashboard.costHourDesc')
        }, {
            id: "costCycle",
            title: t('employeeDashboard.costCycle'),
            description: t('employeeDashboard.costCycleDesc')
        }, {
            id: "costEffective",
            title: t('employeeDashboard.costEffective'),
            description: t('employeeDashboard.costEffectiveDesc')
        }, {
            id: "costEfficiency",
            title: t('employeeDashboard.costEfficiency'),
            description: t('employeeDashboard.costEfficiencyDesc')
        }, {
            id: "totalCost",
            title: t('employeeDashboard.totalCost'),
            description: t('employeeDashboard.totalCostDesc')
        }, {
            id: "confidence",
            title: t('employeeDashboard.confidence'),
            description: t('employeeDashboard.confidenceDesc')
        }, {
            id: "observations",
            title: t('employeeDashboard.observations'),
            description: t('employeeDashboard.observationsDesc')
        }]
    }]
}

export const tempActivityData = (t: any) => {
    return [{
        head: t('employeeDashboard.tempActivityHead'),
        items: [{
            id: "",
            title: t('employeeDashboard.tempActivity1'),
            description: t('employeeDashboard.tempActivity1Desc')
        }, {
            id: "",
            title: t('employeeDashboard.tempActivity2'),
            description: t('employeeDashboard.tempActivity2Desc')
        }, {
            id: "",
            title: t('employeeDashboard.tempActivity3'),
            description: t('employeeDashboard.tempActivity3Desc')
        }]
    }]
}

export const descriptionTypeActivity = (t: any): any => ({
    "weeklyStartAvg": t('employeeDashboard.tempActivity11'),
    "weeklyEndAvg":  t('employeeDashboard.tempActivity22'),
    "weeklyWorkAvg": t('employeeDashboard.tempActivity33'),
})