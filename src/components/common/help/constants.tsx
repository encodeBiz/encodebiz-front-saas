export const operationData = (t: any) => {
    return [{
        head: t('statsCheckbiz.help.opsData.title'),
        items: [
            { id: "operationalSchedule", title: t('statsCheckbiz.help.opsData.items.operationalSchedule.title'), description: t('statsCheckbiz.help.opsData.items.operationalSchedule.desc') },
            { id: "weeklyLoad", title: t('statsCheckbiz.help.opsData.items.weeklyLoad.title'), description: t('statsCheckbiz.help.opsData.items.weeklyLoad.desc') },
            { id: "costPerHour", title: t('statsCheckbiz.help.opsData.items.costPerHour.title'), description: t('statsCheckbiz.help.opsData.items.costPerHour.desc') },
            { id: "costPerDay", title: t('statsCheckbiz.help.opsData.items.costPerDay.title'), description: t('statsCheckbiz.help.opsData.items.costPerDay.desc') },
            { id: "costPerformance", title: t('statsCheckbiz.help.opsData.items.costPerformance.title'), description: t('statsCheckbiz.help.opsData.items.costPerformance.desc') },
            { id: "costReturn", title: t('statsCheckbiz.help.opsData.items.costReturn.title'), description: t('statsCheckbiz.help.opsData.items.costReturn.desc') },
            { id: "reliability", title: t('statsCheckbiz.help.opsData.items.reliability.title'), description: t('statsCheckbiz.help.opsData.items.reliability.desc') },
            { id: "dataVolume", title: t('statsCheckbiz.help.opsData.items.dataVolume.title'), description: t('statsCheckbiz.help.opsData.items.dataVolume.desc') },
        ]
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
