import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { Chip } from "@mui/material";
import InfoModal from "../modals/InfoModal";
import { useTranslations } from "next-intl";



const colorRepository: any = {
    "failed": '#F4AA32',
    "active": 'rgba(122, 223, 127, 0.65)',
    "revoked": 'rgba(177, 35, 33, 0.65)',
    "default": 'rgba(0, 84, 202, 0.08)',
    "archived": 'rgba(199, 184, 22, 0.63)',
    'gray': 'rgba(121, 123, 125, 0.08)',
}

export const CustomChip = ({ label, background = "default", id = '', text = '', ...props }: { label: string; id?: string; text?: string; background?: string; } & any) => {
    const { open, openModal } = useCommonModal()
    const t = useTranslations()
    return (<>
        <Chip
            key={id}
            label={label}
            variant="outlined"
            onClick={() => {
                if (text) openModal(CommonModalType.INFO, { data: id })
            }}
            sx={{
                background: colorRepository[background],
                borderColor: (theme) => background == "default" ? theme.palette.primary.main : colorRepository[background],
                px: 1, py: 2,
                width: 'fit-content',
                cursor: text ? 'pointer' : 'default',
                ...props.sx
            }}
            {...props}
        />

        {text && open.args?.data === id && open.type === CommonModalType.INFO && <InfoModal

            title={t('core.label.message')}
            description={text}

        />}
    </>
    );
}   