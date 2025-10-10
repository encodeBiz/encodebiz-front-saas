import React, { useCallback, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Avatar,
  Chip,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  CloudUpload
} from '@mui/icons-material';
import { useStyles } from './MediaModalSelectedFiles.styles';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useMedia } from '@/hooks/useMedia';
import { useTranslations } from 'next-intl';
import { uploadMedia } from '@/services/core/media.service';
import { useEntity } from '@/hooks/useEntity';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { IUserMedia, IUserMediaType } from '@/domain/core/IUserMedia';
import { fileTypes } from '@/config/constants';
import { formatFileSize, getFileIcon } from '@/lib/common/String';
import { ImageCropper } from '../../ImageCropper/ImageCropper';
import { SassButton } from '../../buttons/GenericButton';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { CustomTypography } from '../../Text/CustomTypography';
 
export interface IMedia {
  preview: string
  file: File
}

export interface MediaModalSelectedFilesProps {
  onSelected: (media: IUserMedia) => void
  onFailed?: (text: string) => void
  type?: IUserMediaType
  crop?: boolean
}


const MediaModalSelectedFiles = ({ onSelected, crop = true, type = 'custom', onFailed }: MediaModalSelectedFilesProps) => {
  const theme = useTheme()
  const classes = useStyles(theme);
  const { userMediaList, fetchUserMedia } = useMedia()
  const { currentEntity } = useEntity()
  const { user, token } = useAuth()
  const { showToast } = useToast()
  const [selectedFile, setSelectedFile] = useState<any>([]);
  const [selectedType, setSelectedType] = useState<string>(type)
  const { open, closeModal } = useCommonModal()
  const [isUploading, setIsUploading] = useState(false);
  const t = useTranslations();

  const handleClose = () => {
    closeModal(CommonModalType.FILES)
  }

  const handleSelectedChange = () => {
    onSelected(userMediaList.find(e => e.id === selectedFile) as IUserMedia)
    closeModal(CommonModalType.FILES)
  }


  const renameFile = async (originalFile: File, newName: string) => {
    // Get the file data
    const buffer = await originalFile.arrayBuffer();

    // Create new file with same data but new name
    return new File([buffer], newName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified
    });
  }

  const handleFile = useCallback(async (file: File) => {
    const renameF = await renameFile(file, file.name)

    try {
      if (!file) return;
      setIsUploading(true);
      const form = new FormData();
      form.append('entityId', currentEntity?.entity.id as string);
      form.append('uid', user?.id as string);
      form.append('type', selectedType);
      form.append('file', renameF);
      const mediaId = (await uploadMedia(form, token) as { mediaId: string })?.mediaId


      setSelectedFile(mediaId)
      fetchUserMedia()
      setIsUploading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(String(error), 'error');
      }
      setIsUploading(false);
    }
  }, [currentEntity?.entity.id, fetchUserMedia, selectedType, showToast, token, user?.id]);



  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const image = new Image();
      image.onload = function () {
        const size: { w: number, h: number } = fileTypes(t).find(e => e.value === type)?.size as { w: number, h: number }
        const minWidth = size.w
        const minHeigth = size.h
        if (image.width === minWidth && image.height === minHeigth) {
          handleFile(file)
        } else {
          handleClose()
          if (typeof onFailed === 'function')
            onFailed(`${minWidth}x${minHeigth}`)
          
        }
      }
      image.src = URL.createObjectURL(file);

    }
  };

  return (
    <Dialog
      open={open.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="lg"
      slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
          <CustomTypography>{t('core.title.mediaModaltitle')}</CustomTypography>
        </Box>
        <CustomIconBtn
          onClick={() => handleClose()}
          color={theme.palette.primary.main}
        />
      </DialogTitle>

      <DialogContent>
        <Paper sx={classes.root} elevation={0}>
          <Box sx={classes.header}>
            <Box sx={{ ...classes.header, gap: 4 }} >
              {crop ? <ImageCropper size={type !== 'custom' ? fileTypes(t).find(e => e.value === type)?.size : { locked: false, w: 0, h: 0 }} isUploading={isUploading} onComplete={handleFile} /> :
                <SassButton
                  component="label"
                  variant="outlined"
                  color="primary"
                  startIcon={!isUploading ? <CloudUpload /> : <CircularProgress color='inherit' size={24} />}
                  disabled={!selectedType}
                  sx={{ width: 340, height: 55 }}
                >
                  {t('core.label.uploadResourse')}
                  <TextField
                    onChange={handleFileChange}
                    type="file"
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

                    //accept={accept}
                    //
                    disabled={!selectedType}
                  />
                </SassButton>}
              {type === 'custom' && <FormControl required sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-required-label">{t('media.labelType')}</InputLabel>
                <Select
                  style={{ minWidth: 100 }}
                  labelId="locale-switcher-label"
                  id="locale-switcher-select"
                  value={selectedType}
                  label={t('media.labelType')}
                  disabled={isUploading || type !== 'custom'}
                  onChange={(e) => setSelectedType(e.target.value as string)}
                >
                  {fileTypes(t).map((item: { label: string, value: string }, i: number) => (
                    <MenuItem key={i} value={item.value}>
                      <Typography sx={{ textTransform: 'capitalize' }}>{item.label}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>}
            </Box>
          </Box>

          <Divider />

          <Box sx={classes.content}>
            {userMediaList.filter(e => (type === 'custom' ? true : (e.type === type))).length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center">
                {t('core.table.nofile')}
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {userMediaList.filter(e => (type === 'custom' ? true : (e.type === type))).map((file: IUserMedia, index: number) => (
                  <Grid sx={{ position: 'relative', cursor: 'pointer' }} size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Box
                      sx={selectedFile !== file.id ? { ...classes.fileItem } : { ...classes.selectedFile }}
                      onClick={() => setSelectedFile(file.id)}
                    >
                      {selectedFile === file.id && (
                        <CheckCircleIcon sx={classes.checkIcon} />
                      )}

                      <Box display="flex" alignItems="center">

                        <Box sx={classes.fileThumbnail}>
                          {file.url ? (
                            <Avatar
                              variant="rounded"
                              src={file.url}
                              style={{ width: '100%', height: '100%' }}
                            />
                          ) : (
                            <Avatar variant="rounded" style={{ backgroundColor: 'transparent' }}>
                              {getFileIcon(file)}
                            </Avatar>
                          )}
                        </Box>

                        <Box sx={classes.fileInfo}>
                          <Typography
                            sx={{ overflow: 'hidden', width: '200px', whiteSpace: 'noWrap', textOverflow: 'ellipsis', }}
                            variant="body2" noWrap>
                            {file.filename}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatFileSize(file.sizeKB * 1024)}
                          </Typography>
                          <Box mt={0.5}>
                            <Chip
                              size="small"
                              label={file.type}
                              variant="outlined"
                            />
                          </Box>
                        </Box>


                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Divider />

          <Box sx={classes.footer}>

            <Typography variant="body2" color="textSecondary">
              {userMediaList.filter(e => (type === 'custom' ? true : (e.type === type))).length} media{userMediaList.filter(e => (type === 'custom' ? true : (e.type === type))).length > 1 ? 's' : ''} disponibles
            </Typography>
            <SassButton
              variant="contained"
              disabled={(Array.isArray(selectedFile) && selectedFile.length === 0) || !selectedFile}
              color="primary"
              onClick={() => handleSelectedChange()}

            >
              {t('core.button.accept')}
            </SassButton>
          </Box>
        </Paper>
      </DialogContent>

      W
    </Dialog >
  );
};
export default MediaModalSelectedFiles;