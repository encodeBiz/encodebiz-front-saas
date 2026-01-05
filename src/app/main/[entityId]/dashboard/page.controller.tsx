/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@/hooks/useAuth";
import { useCommonModal } from "@/hooks/useCommonModal";
import { useEntity } from "@/hooks/useEntity";
import { useEffect } from "react"

export default function useDashboardController() {
  const { openModal } = useCommonModal()
  const { user } = useAuth() 
  const { currentEntity } = useEntity()
  useEffect(() => {
    if (user?.id && currentEntity?.status=='active') {     
      const isViewOnboarding = localStorage.getItem('view-onboarding-' + user?.id)
      if (!isViewOnboarding) {
        // Apertura automática deshabilitada; usar el botón del header para abrir Onboarding.
      }
    }    
 }, [openModal, user?.id])

  return {}
}
