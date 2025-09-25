import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextInput from '@/components/common/forms/fields/TextInput';
import { emailRule, requiredRule } from '@/config/yupRules';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useParams, useSearchParams } from "next/navigation";
import { createStaff, fetchStaff, updateStaff } from "@/services/passinbiz/staff.service";
import { IStaff } from "@/domain/features/passinbiz/IStaff";
import SelectMultipleInput from "@/components/common/forms/fields/SelectMultipleInput";
import { fetchEvent, search, searchEventsByStaff, updateEvent } from "@/services/passinbiz/event.service";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { Timestamp } from "firebase/firestore";


export default function useStaffController() {
  const t = useTranslations();
  const { showToast } = useToast()

  const { token, user } = useAuth()
  const { currentEntity, watchServiceAccess } = useEntity()
  const searchParams = useSearchParams()
  const { navivateTo } = useLayout()
  const { changeLoaderState } = useLayout()
  const { id } = useParams<{ id: string }>()
  const fieldList = [
    {
      name: 'fullName',
      label: t('core.label.fullName'),
      type: 'text',
      required: true,
      component: TextInput,
    },
    {
      name: 'email',
      label: t('core.label.email'),
      type: 'email',
      required: true,
      component: TextInput,
    },
    {
      name: 'allowedTypes',
      label: t('core.label.typeStaff'),
      type: 'text',
      required: true,
      options: [
        { value: 'event', label: t('core.label.event') },
        { value: 'credential', label: t('core.label.credential') }
      ],
      component: SelectMultipleInput,
      extraProps: {
        onHandleChange: (value: any) => {
          onChangeType(value)
        },
      }
    },
  ]
  const [initialValues, setInitialValues] = useState<Partial<IStaff>>({
    fullName: "",
    email: "",
    role: "validator_credential",
    allowedTypes: []

  });

  const validationSchema = Yup.object().shape({
    fullName: requiredRule(t),
    email: emailRule(t),

  });

  const [loadForm, setLoadForm] = useState(false)
  const [fields, setFields] = useState<any[]>([...fieldList])
  const [eventData, setEventData] = useState<{ loaded: boolean, eventList: Array<IEvent> }>({ loaded: false, eventList: [] })





  const onChangeType = async (typeValue: Array<'credential' | 'event'>) => {

    if (typeValue.includes('event')) {
      setFields([...fieldList,
      {
        name: 'eventList',
        label: t('core.label.event'),
        type: 'text',
        required: true,
        options: [...eventData.eventList.map(e => ({ label: e.name, value: e.id }))],
        component: SelectMultipleInput,
      }
      ])

    } else {
      setFields(prev => [...prev.filter(e => e.name !== 'eventList')])

    }
  }


  const saveEventByStaff = async (eventIdList: Array<string>, staffId: string) => {
    try {

      Promise.all(
        eventIdList.map(async (eventId) => {
          const event: IEvent = await fetchEvent(currentEntity?.entity.id as string, eventId);

          if (!event.assignedStaff) event.assignedStaff = []
          if (!event.assignedStaff.includes(staffId)) {
            event.assignedStaff = [...event.assignedStaff, staffId]
            await updateEvent({
              id: event.id,
              entityId: event.entityId,
              assignedStaff: event.assignedStaff,
              date: (event.date instanceof Timestamp) ? event.date.toDate() : new Date(event.date),
              endDate: (event.endDate instanceof Timestamp) ? event.endDate.toDate() : new Date(event.endDate),
            }, token);

          }
        })
      );

      if (Array.isArray(initialValues.eventList))
        Promise.all(
          initialValues.eventList.map(async (eventId) => {
            const event: IEvent = await fetchEvent(currentEntity?.entity.id as string, eventId);
            if (!eventIdList.includes(eventId)) {
              event.assignedStaff = event.assignedStaff.filter(e => e !== staffId)
              await updateEvent({
                id: event.id,
                entityId: event.entityId,
                date: (event.date instanceof Timestamp) ? event.date.toDate() : new Date(event.date),
                endDate: (event.endDate instanceof Timestamp) ? event.endDate.toDate() : new Date(event.endDate),
                assignedStaff: event.assignedStaff
              }, token);
            }
          })
        );


    } catch (error: any) {

      showToast(error.message, 'error')
    }
  };


  const submitForm = async (values: Partial<IStaff>) => {
    try {
      const dataForm = {
        "fullName": values.fullName,
        "email": values.email,
        "entityId": currentEntity?.entity?.id as string,
        allowedTypes: values.allowedTypes,

        id
      }
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      let data
      if (!id)
        data = await createStaff(dataForm, token)
      else
        await updateStaff(dataForm, token)

      saveEventByStaff(values.eventList as Array<string>, id ? id : data?.id)

      showToast(t('core.feedback.success'), 'success');
      changeLoaderState({ show: false })

      navivateTo(`/passinbiz/staff?params=${searchParams.get('params')}`)
    } catch (error: any) {
      showToast(error.message, 'error')
      changeLoaderState({ show: false })

    }
  };




  const fetchData = async () => {
    try {

      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const staff: IStaff = await fetchStaff(currentEntity?.entity.id as string, id)
      const eventStaffList: Array<IEvent> = await searchEventsByStaff(id)
 
      setInitialValues({
        fullName: staff.fullName ?? "",
        email: staff.email ?? "",
        entityId: currentEntity?.entity.id as string,
        eventList: eventStaffList.map(e => e.id),
        ...staff
      })

      onChangeType(staff.allowedTypes)
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }

  useEffect(() => {
    if (currentEntity?.entity.id && user?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, watchServiceAccess, user?.id])



  const inicializeField = async () => {
    setFields(fieldList)
    setLoadForm(true)


    if (currentEntity?.entity.id && user?.id && id)
      fetchData()
  }
  const inicializeEvent = async () => {
    const eventList = await search(currentEntity?.entity.id as string, {
      ...{
        filters: [
          {
            field: 'status',
            value: 'published',
            operator: '=='
          }
        ]
      } as any, limit: 100
    })
    setEventData({ loaded: true, eventList })
  }

  if (currentEntity?.entity.id && user?.id && !eventData.loaded) inicializeEvent()
  if (currentEntity?.entity.id && user?.id && !loadForm && eventData.loaded) inicializeField()

  return { fields, initialValues, validationSchema, submitForm }
}


