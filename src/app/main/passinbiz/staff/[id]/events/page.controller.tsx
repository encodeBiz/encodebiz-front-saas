import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useToast } from "@/hooks/useToast";
import { useRouter } from "nextjs-toploader/app";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { MAIN_ROUTE } from "@/config/routes";
import { fetchEvent, search, searchEventsByStaff, updateEvent } from "@/services/passinbiz/event.service";
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import TransferList from "@/components/common/forms/fields/TransferListField/TransferListField";

export default function useStaffController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { push } = useRouter()
  const { user, token } = useAuth()
  const { id } = useParams<{ id: string }>()
  const { currentEntity, watchServiceAccess } = useEntity()
  const [eventList, setEventList] = useState<Array<IEvent>>([])
  const { changeLoaderState } = useLayout()
  const [initialValues, setInitialValues] = useState<{ event: Array<string> }>({
    event: [],
  });

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
              entityId: event.entityId,
              assignedStaff: event.assignedStaff
            }, token);
            console.log('1');
            console.log(event);

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
              assignedStaff: event.assignedStaff
            }, token);
            console.log('2');
            console.log(event);
          }
        })
      );

      changeLoaderState({ show: false })
      showToast(t('core.feedback.success'), 'success');
      push(`/${MAIN_ROUTE}/passinbiz/staff`)
    } catch (error: any) {
      changeLoaderState({ show: false })
      showToast(error.message, 'error')
    }
  }; 


  const fields = [
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
  ];

  const fetchData = useCallback(async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      const eventStaffList: Array<IEvent> = await searchEventsByStaff(id)
      setInitialValues({
        event: eventStaffList.map(e => e.id)
      })
      const eventList: IEvent[] = await search(currentEntity?.entity.id as string, { limit: 100 } as any)
      setEventList(eventList)
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