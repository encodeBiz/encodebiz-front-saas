import { CommonModalType } from "@/contexts/commonModalContext";
import { useCommonModal } from "@/hooks/useCommonModal";
import { Chip } from "@mui/material";
import InfoModal from "../modals/InfoModal";
import { useTranslations } from "next-intl";



const colorRepository: any = {
    'pending-employee-validation': 'rgba(121, 123, 125, 0.08)',
    'in_review': 'rgba(121, 123, 125, 0.08)',
    "failed": '#F4AA32',
    "active": 'rgba(122, 223, 127, 0.65)',
    "valid": 'rgba(122, 223, 127, 0.65)',
    "revoked": 'rgba(177, 35, 33, 0.65)',
    "revoke": 'rgba(177, 35, 33, 0.65)',
    "default": 'rgba(0, 84, 202, 0.08)',
    "archived": 'rgba(199, 184, 22, 0.63)',
    'gray': 'rgba(121, 123, 125, 0.08)',
    'disabled': 'rgba(121, 123, 125, 0.08)',
    "pending": 'rgba(122, 166, 223, 0.65)',
    "resolved": 'rgba(122, 223, 127, 0.65)',
    "success": 'rgba(46, 125, 50, 0.16)',
    "warning": 'rgba(237, 108, 2, 0.18)',
    "error": 'rgba(211, 47, 47, 0.18)',
    "info": 'rgba(2, 136, 209, 0.16)',
    "neutral": 'rgba(121, 123, 125, 0.12)',

    'rejected': 'rgba(121, 123, 125, 0.08)',
}

const borderColorRepository: any = {
    success: 'rgba(46, 125, 50, 0.7)',
    warning: 'rgba(237, 108, 2, 0.7)',
    error: 'rgba(211, 47, 47, 0.7)',
    info: 'rgba(2, 136, 209, 0.7)',
    neutral: 'rgba(121, 123, 125, 0.5)',
}

const textColorRepository: any = {
    success: '#1b5e20',
    warning: '#8a4b00',
    error: '#b71c1c',
    info: '#01579b',
    neutral: '#4f5156',
}

export const CustomChip = ({ label, background = "default", id = '', role = 'button', text = '', ...props }: { label: string; id?: string; text?: string; background?: string; role: 'ship' | 'button' } & any) => {
    const { open, openModal } = useCommonModal()
    const t = useTranslations()
    return (<>
        <Chip
            key={id}
            label={label}
            variant="outlined"
            onClick={role === 'button' ? () => {
                if (text) openModal(CommonModalType.INFO, { data: id })
            } : null}
            sx={{
                background: colorRepository[background],
                borderColor: (theme) => borderColorRepository[background] ?? (background == "default" ? theme.palette.primary.main : background == "disabled" ? theme.palette.grey[400] : colorRepository[background]),
                color: textColorRepository[background],
                px: props.size == 'small' ? 0 : 1, py: props.size == 'small' ? 0 : 2,
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
