import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { fetchEvent, search, searchEventsByStaff, updateEvent } from "@/services/passinbiz/event.service";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useParams, useSearchParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import TransferList from "@/components/common/forms/fields/TransferListField/TransferListField";
import { Timestamp } from "firebase/firestore";

export default function useStaffController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { navivateTo } = useLayout()
  const { user, token } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()
  const [fields, setFields] = useState<Array<any>>([])
  const [initialValues, setInitialValues] = useState<{ event: Array<string> }>({
    event: [],
  });
  const searchParams = useSearchParams()

  const validationSchema = Yup.object().shape({

  });

  const setDinamicDataAction = async (values: { event: Array<string> }) => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })


      await Promise.all(
        values.event.map(async (eventId) => {
          const event: IEvent = await fetchEvent(currentEntity?.entity.id as string, eventId);
          if (!event.assignedStaff) event.assignedStaff = []
          if (!event.assignedStaff.includes(id)) {
            event.assignedStaff = [...event.assignedStaff, id]
            await updateEvent({
              id: event.id,
              date: (event.date instanceof Timestamp) ? event.date.toDate() : new Date(event.date),
              endDate: (event.endDate instanceof Timestamp) ? event.endDate.toDate() : new Date(event.endDate),
              entityId: event.entityId,
              assignedStaff: event.assignedStaff
            }, token);

          }
        })
      );

      await Promise.all(
        initialValues.event.map(async (eventId) => {
          const event: IEvent = await fetchEvent(currentEntity?.entity.id as string, eventId);
          if (!values.event.includes(eventId)) {
            event.assignedStaff = event.assignedStaff.filter(e => e !== id)
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

      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      navivateTo(`/passinbiz/staff?params=${searchParams.get('params')}`)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  };




  const fetchData = useCallback(async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const eventStaffList: Array<IEvent> = await searchEventsByStaff(id)

      setInitialValues({
        event: eventStaffList.map(e => e.id)
      })
      const eventList: IEvent[] = await search(currentEntity?.entity.id as string, { limit: 100 } as any)

      setFields([
        {
          isDivider: true,
          label: t('core.label.events'),
        },
        {
          name: 'event',
          label: t('core.label.events'),
          type: 'text',
          required: false,
          fullWidth: true,
          options: [eventList.map(event => ({ value: event.id as string, label: `${event.name} (${event.location})` }))].flat(),
          component: TransferList,
          extraProps: {
            leftTitle: t('core.label.availableEvent'),
            rightTitle: t('core.label.selectedEvent'),
          }
        },
      ])
      changeLoaderState({ show: false })
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }, [id, t, showToast, changeLoaderState, currentEntity?.entity.id]);




  useEffect(() => {
    if (currentEntity?.entity.id && user?.id && id) {
      fetchData()
    }

    if (currentEntity?.entity.id && user?.id) {
      watchServiceAccess('passinbiz')
    }
  }, [currentEntity?.entity.id, user?.id, id, fetchData, watchServiceAccess])


  return { fields, initialValues, validationSchema, setDinamicDataAction }
}