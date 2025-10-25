'use client';
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControlLabel, FormGroup, IconButton, Switch, Typography } from '@mui/material';
import { useTranslations } from "next-intl";
import GenericForm, { FormField } from '@/components/common/forms/GenericForm';
import { EmployeeEntityResponsibility, Job } from '@/domain/features/checkinbiz/IEmployee';
import useSucursalFromItemController from './SucursalFromItem.controller';
import { ExpandMoreOutlined } from '@mui/icons-material';
import { useEntity } from '@/hooks/useEntity';
import { useRef } from 'react';
import { TrashIcon } from '@/components/common/icons/TrashIcon';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';



export default function SucursalFromItem({ item }: { item: EmployeeEntityResponsibility, jobList: Array<Job> }) {
    const { fields, initialValues, validationSchema, handleSubmit, active, setActive } = useSucursalFromItemController(item);
    const t = useTranslations();
    const { currentEntity } = useEntity()

    const { openModal } = useCommonModal()

    const formRef = useRef(null)



    return (

        <Accordion sx={{ width: '100%' }}>

            <AccordionSummary
                expandIcon={<ExpandMoreOutlined />}
                aria-controls="panel1-content"
                id="panel1-header"
                
                sx={{ height: 56 }}
            >
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} width={'100%'}>
                    <Box display={'flex'} flexDirection={'column'}>
                        <Typography component="span" textTransform={'uppercase'}>{currentEntity?.entity?.name}</Typography>
                        <Typography color='textSecondary' component="span" >{item.branch?.name}</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection={'row'} gap={2} mr={2}>
                        <FormGroup>
                            <FormControlLabel control={<Switch checked={active == 1} onChange={(e) => setActive(e.target.checked ? 1 : 0)} />} label={t('core.label.active')} />
                        </FormGroup>
                        <IconButton color='error' onClick={() => openModal(CommonModalType.DELETE,{id:item.id, responsability:true})}><TrashIcon /></IconButton>

                    </Box>
                </Box>

            </AccordionSummary>
            <AccordionDetails>

                <GenericForm<Partial<any>>
                    column={3}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                    fields={fields as FormField[]}
                    enableReinitialize
                    activateWatchStatus={true}
                    hideBtn={false}
                    formRef={formRef}

                />
            </AccordionDetails>
        </Accordion>

    );
}
