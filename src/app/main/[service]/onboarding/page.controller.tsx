/* eslint-disable react-hooks/exhaustive-deps */
import { collection } from "@/config/collection";
import { IPlan } from "@/domain/core/IPlan";
import { IService } from "@/domain/core/IService";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { updateDocument } from "@/lib/firebase/firestore/updateDocument";
import { fetchAvailablePlans, fetchService, fetchServiceList } from "@/services/common/subscription.service";
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
  const {currentLocale} = useAppLocale()


  const [pending, setPending] = useState(false)

  const fetchData = useCallback(async (featuredList: Array<string>) => {
    try {
      setPending(true)
      const planData = await fetchAvailablePlans(service)
      const planList: Array<IPlan> = []

      planData.sort((a, b) => a.order - b.order).forEach(element => {
        //if (element.allowCustomTemplate && element.allowBranding) featuredList.push(t("salesPlan.brandingCustom"))
        planList.push({
          id: element.id as string,
          name: element.id,
          monthlyPrice: element.monthlyPrice,
          pricePerUse: element.pricePerUse,
          priceYear: '-',
          period: element.payPerUse ? '/Pase o Credencial' : `/${t("salesPlan.month")}`,
          features: featuredList,
          featuredList: element.featuredList,
          highlighted: element.highlighted,
          order: element.order,
          description: element.description,
          payPerUse: element.payPerUse,
          maxHolders: element.maxHolders
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
      const features: any = sData.featuredList
      await fetchData(features[currentLocale])
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

 /*
  useEffect(() => {
    const f = async () => {
      const s = await fetchServiceList()

      s.forEach(async element => {
        await updateDocument<any>({
          collection: 'service',
          data: {
            ...element,
            about: {
              es: 'Plataforma para crear, enviar y validar pases digitales de eventos y credenciales, compatibles con Apple Wallet y Google Wallet, que agiliza la entrega, evita falsificaciones y simplifica la validación sin equipos adicionales.',
              en: 'Platform for creating, sending, and validating digital event passes and credentials, compatible with Apple Wallet and Google Wallet, that speeds up delivery, prevents counterfeiting, and simplifies validation without additional equipment.'
            },
            description: {
              es: 'Emisión y validación de pases digitales, compatibles con Apple Wallet y Google Wallet.',
              en: 'Issuance and validation of digital passes, compatible with Apple Wallet and Google Wallet.'
            },
            featuredList: {
              es: element.featuredList,
              en: element.featuredList,
            }
          },
          id: element?.id as string,
        });
      });
    }
    f()

  }, [])
*/


  return { serviceData, pending, planList, dataTab1, dataTab2 }
}