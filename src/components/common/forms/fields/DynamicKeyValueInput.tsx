import React, { } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { FieldProps, useField } from 'formik';
import { useTranslations } from 'next-intl';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Add } from '@mui/icons-material';
import { SassButton } from '../../buttons/GenericButton';

interface DynamicField {
    label: string;
    value: string;
}

export type DynamicFields = Array<DynamicField>;

const emptyItem = { label: '', value: '' };

const DynamicKeyValueInput: React.FC<FieldProps> = ({ ...props }) => {

    const [field, , helper] = useField(props);


    const t = useTranslations();

    const handleAdd = () => {
        const newFields = [...field.value, { ...emptyItem }];
        helper.setValue(newFields)
    };

    const handleRemove = (index: number) => {
        const newFields = field.value?.filter((_: any, i: number) => i !== index);
        helper.setValue([...newFields])
    };

    const handleChange = (index: number, key: keyof DynamicField) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newFields = [...field.value];
        newFields[index][key] = e.target.value;
        helper.setValue(newFields)

    };



    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>

            {(field.value as Array<{ label: string, value: string }>)?.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', width: '100%' }}>
                    <TextField
                        label={t("core.label.label")}
                        value={item.label}
                        onChange={handleChange(index, 'label')}
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        label={t("core.label.value")}
                        value={item.value}
                        onChange={handleChange(index, 'value')}
                        fullWidth
                        variant="outlined"
                    />
                    <Button
                        color="primary"
                        onClick={() => handleRemove(index)}
                        variant="contained"
                        
                    >
                        {<DeleteForeverIcon />}
                    </Button>
                    {field.value?.length - 1 === index && <Button
                        color="primary"
                        onClick={() => handleAdd()}
                        variant="contained"
                       
                        >
                        {<Add />}
                    </Button>}
                </Box>
            ))}
            {field.value?.length === 0 &&
                <SassButton
                    color="primary"
                    onClick={() => handleAdd()}
                    variant="contained"
                    size="large">
                    {<Add />} {t('core.label.addNew')}
                </SassButton>}
        </Box>
    );
};

export default DynamicKeyValueInput;