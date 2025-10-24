/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { EmployeeEntityResponsibility, IEmployee, Job } from "@/domain/features/checkinbiz/IEmployee";
import { searchJobs, searchResponsability } from "@/services/checkinbiz/employee.service";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { fetchSucursal, search } from "@/services/checkinbiz/sucursal.service";
import { useTranslations } from 'next-intl';

export default function useBranchDetailController(employee: IEmployee) {
    const { showToast } = useToast()
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal } = useCommonModal()
    const t = useTranslations()
    const { changeLoaderState } = useLayout()


    const [branchList, setBranchList] = useState<Array<ISucursal>>([])
    const fetchSucursalList = async () => {
        setBranchList(await search(currentEntity?.entity.id as string, { ...{} as any, limit: 100 }))
    }

    useEffect(() => {
        if (currentEntity?.entity.id)
            fetchSucursalList()
    }, [currentEntity?.entity.id])


    const [entityResponsibilityList, setEntityResponsibilityListList] = useState<Array<EmployeeEntityResponsibility>>([])
    const addEntityResponsibility = async (branchId: string) => {
        setEntityResponsibilityListList([...entityResponsibilityList, {
            employeeId: employee.id as string,
            responsibility: 'worker',
            level: 4,
            scope: { entityId: currentEntity?.entity.id as string, branchId, scope: 'branch' },
            job: {
                job: '',
                price: 0,
                id: ''
            },
            active: 1,
            branch: await fetchSucursal(currentEntity?.entity.id as string, branchId)
        }])
    }


    const [jobList, setJobList] = useState<Array<Job>>([])
    const fetchJobList = async () => {
        try {
            setJobList(await searchJobs(currentEntity?.entity.id as string))
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
        changeLoaderState({ show: false })
    }



    const [responsabilityLimit, setResponsabilityLimit] = useState(5)
    const [responsabilityTotal, setResponsabilityTotal] = useState(0)
    const [responsabilityFilter, setResponsabilityFilter] = useState([
        { field: 'active', operator: '==', value: 1 }
    ])
    const fetchResponsabilityList = async (limit: number = 5) => {
        try {
            setResponsabilityLimit(limit)
            const data: Array<EmployeeEntityResponsibility> = await searchResponsability(currentEntity?.entity.id as string, employee.id as string, limit, responsabilityFilter)
            setEntityResponsibilityListList(data)
            if (data.length > 0) setResponsabilityTotal(data[0].totalItems as number)
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
        }
        changeLoaderState({ show: false })
    }

    const loadMore = () => {
        fetchResponsabilityList(responsabilityLimit + 5)
    }


    useEffect(() => {
        if (currentEntity?.entity.id && employee.id) {
            fetchJobList()
            fetchResponsabilityList()
        }

    }, [currentEntity?.entity.id, user?.id, employee.id])

    const addResponsabiltyItem = () => {
        
        console.log(entityResponsibilityList);        
        console.log(branchList)

        if (entityResponsibilityList.length < branchList.length) {
            if (branchList.length === 1) addEntityResponsibility(branchList[0].id as string)
            else {
                openModal(CommonModalType.BRANCH_SELECTED)
            }
        } else {
            showToast(t('employee.maxSelectionBranch'), 'info')
        }

    }

    return {
        addResponsabiltyItem,
        addEntityResponsibility,
        entityResponsibilityList, responsabilityFilter, setResponsabilityFilter,
        branchList, jobList, loadMore, responsabilityTotal, responsabilityLimit
    }
}