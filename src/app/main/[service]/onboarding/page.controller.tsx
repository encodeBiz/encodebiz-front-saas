/* eslint-disable react-hooks/exhaustive-deps */
import { IPlan } from "@/domain/core/IPlan";
import { IService } from "@/domain/core/IService";
import { useAppLocale } from "@/hooks/useAppLocale";
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
  const { currentLocale } = useAppLocale()



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
  }, [user?.id, service, currentEntity?.entity.id, currentLocale])

  const dataTab1 = {
    title: t(`onboarding.${service}.stepsTitle`),
    subtitle: t(`onboarding.${service}.stepsDesc`),
    data: serviceData?.steps ? (serviceData?.steps as any)[currentLocale] : []
  }


  const dataTab2 = {
    title: t(`onboarding.${service}.targetTitle`),
    subtitle: t(`onboarding.${service}.targetDesc`),
    data: serviceData?.target ? (serviceData?.target as any)[currentLocale] : []
  }

  /*
  useEffect(() => {
    const f = async () => {
      const s = await fetchServiceList()
      const list = [
        "Emisión Apple/Google Wallet.",
        "Validación QR en tiempo real.",
        "Credenciales digitales.",
        "Módulo de eventos",
        "Branding personalizado.",
        "Multi-entidad.",
        "Emisión de eventos webhook.",
        "Soporte de desarrollo, bajo convenio.",
        "Limite de emisiones:",
        "Soporte sin desarrollo."
      ]

      const listEn = [
        "Apple/Google Wallet issuance.",
        "Real-time QR code validation.",
        "Digital credentials.",
        "Event module.",
        "Custom branding.",
        "Multi-entity.",
        "Webhook event issuance.",
        "Development support, under agreement.",
        "Issuance limit:",
        "Support without development."
      ]

      const stepsEs = [
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

      const stepsEn = [
        {
          title: 'Set up your entity',
          description: 'Before continuing, we recommend setting up your branding (logo, colors) and billing. This ensures that your passes and credentials issue with your identity and that you can operate frictionlessly.'
        },
        {
          title: 'Choose your plan',
          description: 'Select the plan that best fits your operational and volume needs.'
        },
        {
          title: 'Free plan? Start issuing passes without customization',
          description: 'If you choose the Free plan and need personalized passes for an event, you can request a free trial from the Events section.'
        },
        {
          title: 'Paid plan? Create unlimited passes and credentials',
          description: 'With setup complete and an active paid plan, you can now create fully customized passes and credentials (event, staff, badge, employee, student).'
        }, {
          title: 'Create your event (optional)',
          description: 'Generate events with their own cards and rules: dates, locations, roles (attendee/VIP/press/staff), and branded templates.'
        },
        {
          title: 'Upload attendees via CSV (bulk issuance)',
          description: 'Upload a CSV to upload passes in bulk. Make sure to follow the format specifications to avoid errors.'
        },
      ]

      const tab2Es = [
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

      const tab2En = [
        {
          title: 'Queues and delays at entrances',
          description: 'Attendees no longer wait: they carry their digital badge on their mobile phone, ready to show.'
        },
        {
          title: 'Fraud and duplicate badges',
          description: 'Each badge is unique, validated in real time against the database: impossible to falsify.'
        },
        {
          title: 'External equipment costs',
          description: 'Forget about scanners or expensive systems: you can validate with any internet-connected device with a camera.'
        },
        {
          title: 'Customize your digital badges',
          description: 'Upload your logo, define colors, and add key information.'
        },
        {
          title: 'Send automatically',
          description: 'Each person receives their digital badge by email, ready for Apple Wallet or Google Wallet.'
        },
        {
          title: 'Technical limitations of other systems',
          description: 'If you need integrations with your CRM, ERP, or other internal systems, our technical team is here to help with specialized support and custom development available in the Business plan.'
        },
      ]



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
              es: list,
              en: listEn,
            },
            steps: {
              es: stepsEs,
              en: stepsEn
            },
            target: {
              es: tab2Es,
              en: tab2En
            },
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