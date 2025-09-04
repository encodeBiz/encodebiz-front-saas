import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { fetchEvent, updateEvent } from "@/services/passinbiz/event.service";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useParams, useSearchParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import TransferList from "@/components/common/forms/fields/TransferListField/TransferListField";
import { search } from "@/services/passinbiz/staff.service";
import { IStaff } from "@/domain/features/passinbiz/IStaff";


export default function useStaffController() {
  const t = useTranslations();
  const { showToast } = useToast()
 const { navivateTo } = useLayout()
  const { token, user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity, watchServiceAccess } = useEntity()
  const [staffList, setStaffList] = useState<Array<IStaff>>([])
  const { changeLoaderState } = useLayout()
  const searchParams = useSearchParams()
  
  const [initialValues, setInitialValues] = useState<Partial<IEvent>>({
    assignedStaff: [],
  });

  const validationSchema = Yup.object().shape({

  });

  const setDinamicDataAction = async (values: Partial<IEvent>) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const data: Partial<IEvent> = {
        "uid": user?.id as string,
        "createdBy": user?.id as string,
        "assignedStaff": values.assignedStaff || [],
        "entityId": currentEntity?.entity?.id as string,
        "id": id,
      }
      if (id) await updateEvent(data, token)
      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      navivateTo(`/passinbiz/event?params=${searchParams.get('params')}`)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };


  const fields = [
    {
      isDivider: true,
      label: t('core.label.staff'),
    },
    {
      name: 'assignedStaff',
      label: t('core.label.staff'),
      type: 'text',
      required: false,
      fullWidth: true,
      options: [staffList.map(staff => ({ value: staff.id as string, label: `${staff.fullName} (${staff.email})` }))].flat(),
      component: TransferList,
      extraProps: {
        leftTitle: t('core.label.availableStaff'),
        rightTitle: t('core.label.selectedStaff'),
      }
    },
  ];

  const fetchData = useCallback(async () => {

    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const event: IEvent = await fetchEvent(currentEntity?.entity.id as string, id)     
      
      setInitialValues({
        ...event
      })

       const staffList: IStaff[] = await search(currentEntity?.entity.id as string, { limit: 100 } as any)
      setStaffList(staffList)
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [changeLoaderState, currentEntity?.entity.id, id, showToast, t])


  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id) {
      fetchData()
    }

    if (currentEntity?.entity.id && user?.id) {
      watchServiceAccess('passinbiz')

    }
  }, [currentEntity?.entity.id, user?.id, id, fetchData, watchServiceAccess])


  return { fields, initialValues, validationSchema, setDinamicDataAction, staffList }
}