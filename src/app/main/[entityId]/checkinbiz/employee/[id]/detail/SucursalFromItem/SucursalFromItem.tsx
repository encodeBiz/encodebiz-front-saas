'use client';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { useFormStatus } from '@/hooks/useFormStatus';
import { useRef } from 'react';
import { SassButton } from '@/components/common/buttons/GenericButton';
import { EmployeeEntityResponsibility } from '@/domain/features/checkinbiz/IEmployee';
import useSucursalFromItemController from './SucursalFromItem.controller';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { useEntity } from '@/hooks/useEntity';



export default function SucursalFromItem({item}:{item: EmployeeEntityResponsibility}) {
    const { fields, initialValues, validationSchema, handleSubmit } = useSucursalFromItemController(item);
    const t = useTranslations();

    const formRef = useRef(null)
    const { formStatus } = useFormStatus()
    const { currentEntity } = useEntity()

    const handleExternalSubmit = () => {
        if (formRef.current) {
            (formRef.current as any).submitForm()
        }
    }


    return (

        <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreOutlined />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ height: 56 }}
            >
                <Typography component="span" textTransform={'uppercase'}>{currentEntity?.entity?.name}</Typography>
                <Typography color='textSecondary' component="span" >{item.branch?.name}</Typography>

                <SassButton
                    disabled={!formStatus?.isValid || formStatus?.isSubmitting}
                    onClick={handleExternalSubmit}
                    variant='contained'
                > {t('core.button.saveChanges')}</SassButton>
            </AccordionSummary>
            <AccordionDetails>
                <GenericForm<Partial<any>>
                    column={2}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                    fields={fields as FormField[]}
                    enableReinitialize
                    activateWatchStatus
                    hideBtn
                    formRef={formRef}
                />
            </AccordionDetails>
        </Accordion>

    );
}
