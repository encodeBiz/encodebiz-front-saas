/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { IIssue } from "@/domain/features/checkinbiz/IIssue";
import { fetchEmployee, fetchIssue } from "@/services/checkinbiz/employee.service";
import { fetchSucursal } from "@/services/checkinbiz/sucursal.service";


export default function useIssuesDetailController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity } = useEntity()
  const { changeLoaderState } = useLayout()
  const [initialValues, setInitialValues] = useState<Partial<IIssue>>({});


  const fetchData = async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const issue: IIssue = await fetchIssue(id)
      const employee = (await fetchEmployee(currentEntity?.entity.id as string, issue.employeeId as string))
      const branch = (await fetchSucursal(currentEntity?.entity.id as string, issue.branchId as string))

      setInitialValues({
        ...issue, employee, branch
      })
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }, [currentEntity?.entity.id, user?.id, id])




  const rowAction: Array<any> = []

  const onSuccess = () => {
    fetchData()
  }


  return { initialValues, rowAction, onSuccess }
}