/* eslint-disable react-hooks/exhaustive-deps */
import { IPlan } from "@/domain/core/IPlan";
import { IService } from "@/domain/core/IService";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { fetchAvailablePlans, fetchService } from "@/services/common/subscription.service";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react"

export default function useDashboardController() {
  const { service } = useParams<any>()
  const { user } = useAuth()
  const [serviceData, setServiceData] = useState<IService>()
  const { showToast } = useToast()
  const t = useTranslations()
  const { changeLoaderState } = useLayout()

  const { currentEntity } = useEntity();
  const [planList, setPlanList] = useState<Array<IPlan>>()



  const [pending, setPending] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setPending(true)
      const planData = await fetchAvailablePlans(service)
      const planList: Array<IPlan> = []
       
      planData.forEach(element => {
        const featuredList = [
          'Hasta 4 empleados',
          '1 proyecto activo',
          'Fichaje por geolocalización',
          'Reporte básico mensual (horas trabajadas)',
          'Acceso web y móvil',
        ]
        if (element.allowCustomTemplate && element.allowBranding) featuredList.push(t("salesPlan.brandingCustom"))
        planList.push({
          id: element.id as string,
          name: element.id,
          priceMonth: '€15/Mes',
          priceYear: '108€ año',
          period: `/${t("salesPlan.month")}`,
          features: featuredList,
          featured: element.id === "freemium"
        })
      });
      const dataListOrderded : Array<IPlan> = []
      dataListOrderded.push(planList.find(e=>e.id==='bronze') as IPlan)
      dataListOrderded.push(planList.find(e=>e.id==='freemium') as IPlan)
      dataListOrderded.push(planList.find(e=>e.id==="enterprise") as IPlan)
      setPlanList(dataListOrderded)
      setPending(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(String(error), 'error');
      }
      setPending(false)
    }
  }, [service, showToast, t])

  const fetchServiceData = useCallback(async () => {
    try {
      changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
      setServiceData(await fetchService(service as string))
      await fetchData()
      changeLoaderState({ show: false })
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(String(error), 'error');
      }
      changeLoaderState({ show: false })
    }
  }, [changeLoaderState, fetchData, service, showToast, t])

  useEffect(() => {
    if (service && user?.id && currentEntity?.entity.id)
      fetchServiceData()
  }, [user?.id, service, currentEntity?.entity.id])


  const dataTab1 = {
    title: 'Guía de configuración ',
    subtitle: 'Sigue los pasos de esta guía para configurar el servicio de PassBiz.',
    data: [
      {
        title: 'Asi empiezas',
        description: 'Colección coinciden con los parámetros de consulta. Tus consultas pueden incluir varios filtros en cadena y combinar los filtros con criterios de orden.'
      },
      {
        title: 'Asi empiezas',
        description: 'Colección coinciden con los parámetros de consulta. Tus consultas pueden incluir varios filtros en cadena y combinar los filtros con criterios de orden.'
      },
      {
        title: 'Asi empiezas',
        description: 'Colección coinciden con los parámetros de consulta. Tus consultas pueden incluir varios filtros en cadena y combinar los filtros con criterios de orden.'
      },
      {
        title: 'Asi empiezas',
        description: 'Colección coinciden con los parámetros de consulta. Tus consultas pueden incluir varios filtros en cadena y combinar los filtros con criterios de orden.'
      }, {
        title: 'Asi empiezas',
        description: 'Colección coinciden con los parámetros de consulta. Tus consultas pueden incluir varios filtros en cadena y combinar los filtros con criterios de orden.'
      },
      {
        title: 'Asi empiezas',
        description: 'Colección coinciden con los parámetros de consulta. Tus consultas pueden incluir varios filtros en cadena y combinar los filtros con criterios de orden.'
      },
    ]
  }


  const dataTab2 = {
    title: 'Resuelve con PassBiz lo que antes era un problema:',
    subtitle: 'Sigue los pasos de esta guía para configurar el servicio de PassBiz.',
    data: [
      {
        title: 'Colas y demoras en accesos',
        description: 'Los asistentes ya no esperan: llevan su acreditación digital en el móvil lista para mostrar.'
      },
      {
        title: 'Fraudes y duplicación de acreditaciones',
        description: 'Cada pase es único, validado en tiempo real contra la base de datos: imposible falsificarlo.'
      },
      {
        title: 'Costes de equipos externos',
        description: 'Olvídate de escáneres o sistemas caros: validas con cualquier dispositivo conectado a internet y que disponga de una cámara.'
      },
      {
        title: 'Asi Personaliza tus pases digitales',
        description: 'Sube tu logotipo, define colores y añade la información clave.'
      },
      {
        title: 'Envía automáticamente',
        description: 'Cada persona recibe su pase digital por email, listo para Apple Wallet o Google Wallet.'
      },
      {
        title: 'Valida accesos en tiempo real',
        description: 'Con cualquier dispositivo conectado a internet, sin instalaciones ni hardware adicional.'
      },
      {
        title: 'Limitaciones técnicas de otros sistemas',
        description: 'Si necesitas integraciones con tu CRM, ERP u otros sistemas internos, nuestro equipo técnico te acompaña con soporte especializado y desarrollos a medida disponibles en el plan Empresarial.'
      },

    ]
  }



  return { serviceData, pending, planList, dataTab1, dataTab2 }
}