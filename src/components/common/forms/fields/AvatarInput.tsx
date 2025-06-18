// AvatarInput.tsx
import React from 'react';
import { Avatar, ButtonBase, Typography } from '@mui/material';
import { FieldProps, useField } from 'formik';

interface AvatarInputProps {
    label?: string;
    initialImage?: string | null;
}

const AvatarInput: React.FC<FieldProps & AvatarInputProps> = ({
    field,
    //form,
    label = 'Seleccionar avatar',
    initialImage = null,
}) => {
    const [avatarSrc, setAvatarSrc] = React.useState<string | null>(initialImage);
    //const [fieldValue, meta, helper] = useField(field.name);
    const [, meta, helper] = useField(field.name);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Leer imagen como base64 para previsualizar
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarSrc(reader.result as string);
            helper.setValue(file); // Guardamos el archivo en Formik
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <ButtonBase
                component="label"
                role={undefined}
                tabIndex={-1}
                aria-label={label}
                sx={{
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: meta.touched && meta.error ? '2px solid red' : undefined,
                    '&:has(:focus-visible)': {
                        outline: '2px solid',
                        outlineOffset: '2px',
                    },
                }}
            >
                <Avatar
                    alt="Avatar preview"
                    src={avatarSrc || undefined}
                    sx={{ width: '100%', height: '100%' }}
                />
                <input
                    type="file"
                    accept="image/*"
                    style={{
                        clip: 'rect(0 0 0 0)',
                        clipPath: 'inset(50%)',
                        height: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        whiteSpace: 'nowrap',
                        width: 1,
                    }}
                    onChange={handleFileChange}
                />
            </ButtonBase>

            {/* Mostrar errores */}
            {meta.touched && meta.error && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {meta.error}
                </Typography>
            )}
        </div>
    );
};

export default AvatarInput;