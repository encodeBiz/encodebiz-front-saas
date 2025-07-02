import { useAuth } from "@/hooks/useAuth";
import { useCommonModal } from "@/hooks/useCommonModal";
import { useEffect } from "react"

export default function useDashboardController() {
  const { openModal } = useCommonModal()
  const { user } = useAuth()
  useEffect(() => {
    if (user?.id) {
      const isViewOnboarding = localStorage.getItem('view-onboarding-' + user?.id)
      if (!isViewOnboarding) {
        setTimeout(() => {
          openModal()
        }, 2000);
      }
    }
  }, [user?.id])

  return {}
}