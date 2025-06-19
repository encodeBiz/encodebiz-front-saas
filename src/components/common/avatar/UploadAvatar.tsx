'use client'
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
} from '@mui/material';

type UploadAvatarProps = {
  initialImage?: string | null;
  onImageChange?: (file: File | null) => void;
  onError?: (message: string) => void;
  variant?: 'rounded' | 'circular' | 'square';
  label?: string;
  size?:number;
};

export default function UploadAvatar({
  initialImage = undefined,
  onImageChange,
  onError,
  label,
  variant = "circular",
  size = 100,
}: UploadAvatarProps) {
  const t = useTranslations()
  const [avatarSrc, setAvatarSrc] = useState<string | undefined | null>(initialImage);
  const [error, setError] = useState<string | null>(null);


  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validación: Tipo de archivo debe ser imagen
    if (!file.type.startsWith('image/')) {
      const errorMessage = t(`core.formValidatorMessages.avatarUpload`);
      setError(errorMessage);
      if (onError) onError(errorMessage);
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      const errorMessage = t(`core.formValidatorMessages.avatarMaxSize`);
      setError(errorMessage);
      if (onError) onError(errorMessage);
      return;
    }

    // Si pasa las validaciones:
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarSrc(reader.result as string);
      if (onImageChange) onImageChange(file);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (initialImage) {
      setAvatarSrc(initialImage);
    }
  }, [initialImage]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <ButtonBase
        component="label"
        role={undefined}
        tabIndex={-1} // prevent label from tab focus
        aria-label="Image"
        sx={{
          borderRadius: '40px',
          '&:has(:focus-visible)': {
            outline: '2px solid',
            outlineOffset: '2px',
          },
        }}
      >
        <Avatar
          alt="Image"
          variant={variant}
          src={avatarSrc ?? undefined}
          sx={{ width: size, height: size, border: 1, borderColor: "lightgrey" }}
        />
        <input
          type="file"
          accept="image/*"
          style={{
            border: 1,
            clip: 'rect(0 0 0 0)',
            height: '1px',
            margin: '-1px',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            whiteSpace: 'nowrap',
            width: '1px',
          }}
          onChange={handleAvatarChange}
        />
      </ButtonBase>
      {label &&
        <label
          style={{ marginLeft: "30px", fontSize: "0.75rem", color: "rgba(0, 0, 0, 0.6)" }}
        >{label}</label>}

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};