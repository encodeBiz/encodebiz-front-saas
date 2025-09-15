'use client'

import { CommonModalType } from "@/contexts/commonModalContext";
import { useAuth } from "@/hooks/useAuth";
import { useCommonModal } from "@/hooks/useCommonModal";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { deleteEntity } from "@/services/core/entity.service";
import { Theme } from "@emotion/react";
import { SxProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";


export type TabItem = {
    label: string | ReactNode;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    sx?: SxProps<Theme>;
};

export const useSettingEntityController = () => {
    const [pending, setPending] = useState(false)
    const t = useTranslations();
    const { closeModal } = useCommonModal()
    const { changeLoaderState } = useLayout()
    const { user, token } = useAuth();
    const { showToast } = useToast()
    const { refrestList } = useEntity()
 
    const handleDeleteEntity = async (entityId: string) => {
        setPending(true)
        try {
            changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })
            await deleteEntity({
                uid: user?.id as string,
                entityId: entityId
            }, token)
            changeLoaderState({ show: false })
            refrestList(user?.id as string)
            showToast(t('core.feedback.success'), 'success');
            setPending(false)
            closeModal(CommonModalType.DELETE)
           
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setPending(false)
            changeLoaderState({ show: false })
        }
    }

    return { handleDeleteEntity, pending }
}

