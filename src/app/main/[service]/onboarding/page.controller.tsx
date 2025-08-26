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

  const fetchData = useCallback(async (featuredList:Array<string>) => {
    try {
      setPending(true)
      const planData = await fetchAvailablePlans(service)
      const planList: Array<IPlan> = []
       
      planData.sort((a, b) => a.order - b.order ).forEach(element => {
        //if (element.allowCustomTemplate && element.allowBranding) featuredList.push(t("salesPlan.brandingCustom"))
        planList.push({
          id: element.id as string,
          name: element.id,
          priceMonth: '€15/Mes',
          priceYear: '108€ año',
          period: `/${t("salesPlan.month")}`,
          features: featuredList,
          featured: element.id === "freemium",
          order: element.order
        })
      });
      setPlanList(planList)
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
      const sData = await fetchService(service as string)
      setServiceData(sData)
     
      await fetchData(sData.featuredList)
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

   console.log('fetchServiceData', serviceData)
  const dataTab1 = {
    title: 'Guía de configuración ',
    subtitle: 'Sigue los pasos de esta guía para configurar el servicio de PassBiz.',
    data: [
      {
        title: 'Configura tu entidad',
        description: 'Antes de continuar, te recomendamos configurar tu marca (logo, colores) y tu facturación. Esto asegura que tus pases y credenciales salgan con tu identidad y que puedas operar sin fricciones.'
      },
      {
        title: 'Elige tu plan',
        description: 'Selecciona el plan que mejor se ajuste a tus necesidades operativas y de volumen.'
      },
      {
        title: '¿Plan gratis? Comienza a emitir pases sin personalización',
        description: 'Si eliges el plan Gratis y necesitas pases personalizados para un evento, puedes solicitar una prueba gratuita desde el apartado Eventos.'
      },
      {
        title: '¿Plan de pago? Crea pases y credenciales sin límite',
        description: 'Con la configuración completada y un plan de pago activo, ya puedes crear pases y credenciales totalmente personalizados (evento, staff, acreditación, empleado, alumno).'
      }, {
        title: 'Crea tu evento (opcional)',
        description: 'Genera eventos con sus propias tarjetas y reglas: fechas, ubicaciones, roles (asistente/VIP/prensa/staff) y plantillas con tu marca.'
      },
      {
        title: 'Carga asistentes por CSV (emisión masiva)',
        description: 'Sube un CSV para cargar pases de forma masiva. Asegúrate de seguir las especificaciones de formato para evitar errores.'
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
        title: 'Personaliza tus pases digitales',
        description: 'Sube tu logotipo, define colores y añade la información clave.'
      },
      {
        title: 'Envía automáticamente',
        description: 'Cada persona recibe su pase digital por email, listo para Apple Wallet o Google Wallet.'
      },
      {
        title: 'Limitaciones técnicas de otros sistemas',
        description: 'Si necesitas integraciones con tu CRM, ERP u otros sistemas internos, nuestro equipo técnico te acompaña con soporte especializado y desarrollos a medida disponibles en el plan Empresarial.'
      },

    ]
  }



  return { serviceData, pending, planList, dataTab1, dataTab2 }
}