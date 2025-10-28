/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { EmployeeEntityResponsibility, IEmployee, Job } from "@/domain/features/checkinbiz/IEmployee";
import { handleRespnsability, searchJobs, searchResponsability } from "@/services/checkinbiz/employee.service";
import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal";
import { fetchSucursal, search } from "@/services/checkinbiz/sucursal.service";
import { useTranslations } from 'next-intl';
import { useAppLocale } from '@/hooks/useAppLocale';

export default function useBranchDetailController(employee: IEmployee) {
    const { showToast } = useToast()
    const { user } = useAuth()
    const { currentEntity } = useEntity()
    const { openModal, closeModal } = useCommonModal()
    const t = useTranslations()
    const { changeLoaderState } = useLayout()
    const { currentLocale } = useAppLocale()
    const { token } = useAuth()
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
        const found = entityResponsibilityList.filter(e => ((e.scope as { scope: 'branch'; entityId: string; branchId: string })?.branchId as string) === branchId).length > 0
        if (!found) {
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
        } else {
            showToast(t('employee.branchUsed'), 'info')
        }
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


    const [pending, setPending] = useState(false)
    const [responsabilityLimit, setResponsabilityLimit] = useState(5)
    const [responsabilityTotal, setResponsabilityTotal] = useState(0)
    const [responsabilityFilter, setResponsabilityFilter] = useState([
        { field: 'active', operator: '==', value: 1 }
    ])
    const fetchResponsabilityList = async (limit: number = 5, filter: Array<{ field: string, operator: string, value: any }>) => {
        try {
            setPending(true)
            setResponsabilityLimit(limit)
            const data: Array<EmployeeEntityResponsibility> = await searchResponsability(currentEntity?.entity.id as string, employee.id as string, limit, filter)
            const items: Array<EmployeeEntityResponsibility> = await Promise.all(data.map(async e => {
                const branch = await fetchSucursal(e.scope.entityId, (e.scope as any).branchId)
                return { ...e, branch }
            }))

            setEntityResponsibilityListList(items)
            if (data.length > 0) setResponsabilityTotal(data[0].totalItems as number)

            setPending(false)
        } catch (error: any) {
            changeLoaderState({ show: false })
            showToast(error.message, 'error')
            setPending(false)
        }
        changeLoaderState({ show: false })
    }

    const loadMore = () => {
        fetchResponsabilityList(responsabilityLimit + 5, responsabilityFilter)
    }


    useEffect(() => {
        if (currentEntity?.entity.id && employee.id) {
            fetchJobList()
            fetchResponsabilityList(5, responsabilityFilter)
        }

    }, [currentEntity?.entity.id, user?.id, employee.id])

    const addResponsabiltyItem = () => {

        if (entityResponsibilityList.length < branchList.length) {
            if (branchList.length === 1) addEntityResponsibility(branchList[0].id as string)
            else {
                openModal(CommonModalType.BRANCH_SELECTED)
            }
        } else {
            showToast(t('employee.maxSelectionBranch'), 'info')
        }

    }

    const [deleting, setDeleting] = useState(false)

    const onDelete = async (id: string) => {
        try {
            setDeleting(true)
            const data: any = {
                id
            }
            await handleRespnsability(data, token, currentLocale, 'delete')
            setDeleting(false)
            showToast(t('core.feedback.success'), 'success');
            closeModal(CommonModalType.DELETE)
            onEnd()
        } catch (error: any) {
            setDeleting(false)
            showToast(error.message, 'error')
        }
    };

    const onEnd = () => fetchResponsabilityList(5, responsabilityFilter)
    const onFilter = (filter: Array<{ field: string, operator: string, value: any }>) => {
        setResponsabilityFilter(filter)
        fetchResponsabilityList(5, filter)
    }

    return {
        addResponsabiltyItem, deleting, onEnd,pending,
        addEntityResponsibility, onDelete, onFilter,
        entityResponsibilityList, responsabilityFilter, setResponsabilityFilter,
        branchList, jobList, loadMore, responsabilityTotal, responsabilityLimit
    }
}