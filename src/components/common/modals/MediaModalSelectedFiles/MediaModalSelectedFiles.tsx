import React, { useCallback, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Divider,
  Button,
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
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Audiotrack as AudioIcon,
  Description as DocumentIcon,
  CloudUpload
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { useStyles } from './MediaModalSelectedFiles.styles';
import { BaseButton } from '../../buttons/BaseButton';
import { title } from 'process';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useMedia } from '@/hooks/useMedia';
import { useTranslations } from 'next-intl';
import { uploadMedia } from '@/services/common/media.service';
import { useEntity } from '@/hooks/useEntity';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { IUserMedia, IUserMediaType } from '@/domain/core/IUserMedia';
import { fileTypes } from '@/config/constants';
import { formatFileSize, getFileIcon } from '@/lib/common/String';
import { ImageCropper } from '../../ImageCropper/ImageCropper';

export interface IMedia {
  preview: string
  file: File
}

export interface MediaModalSelectedFilesProps {
  onSelected: (media: IUserMedia) => void
  type?: IUserMediaType
  crop?: boolean
}


const MediaModalSelectedFiles = ({ onSelected, crop = true, type = 'custom' }: MediaModalSelectedFilesProps) => {
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


  const handleFile = useCallback(async (file: File) => {
    try {
      if (!file) return;
      setIsUploading(true);
      const form = new FormData();
      form.append('entityId', currentEntity?.entity.id as string);
      form.append('uid', user?.id as string);
      form.append('type', selectedType);
      form.append('file', file);
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
  }, []);


  const handleFileChange = useCallback(async (event: any) => {
    const file = event.currentTarget.files[0];
    handleFile(file)
  }, [selectedType]);

  return (
    <Dialog
      open={open.open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-title">
        {t('core.title.mediaModaltitle')}
      </DialogTitle>
      <DialogContent>
        <Paper sx={classes.root} elevation={0}>
          <Box sx={classes.header}>


            <Box sx={{ ...classes.header, gap: 4 }} >
              {crop ? <ImageCropper onComplete={handleFile} /> :
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  startIcon={<CloudUpload />}
                  disabled={!selectedType}
                  style={{ width: 340, height: 55 }}
                >

                  {isUploading ? (
                    <CircularProgress size={24} />
                  ) : (
                    t('core.label.uploadResourse')
                  )}

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
                </Button>}
              <FormControl required sx={{ width: '100%' }}>
                <InputLabel id="demo-simple-select-required-label">{t('media.labelType')}</InputLabel>
                <Select
                  style={{ minWidth: 100 }}
                  labelId="locale-switcher-label"
                  id="locale-switcher-select"
                  value={selectedType}
                  label={t('media.labelType')}
                  disabled={isUploading}
                  onChange={(e) => setSelectedType(e.target.value as string)}
                >
                  {fileTypes(t).map((item: { label: string, value: string }, i: number) => (
                    <MenuItem key={i} value={item.value}>
                      <Typography sx={{ textTransform: 'capitalize' }}>{item.label}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider />

          <Box sx={classes.content}>
            {userMediaList.filter(e => (type === 'custom' ? true : (e.type === type))).length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center">
                No files uplaoded
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
              {userMediaList.length} file{userMediaList.length !== 1 ? 's' : ''} disponibles
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSelectedChange()}
              disabled={selectedFile.length === 0}
            >
              Insert Selected
            </Button>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

// Example usage:
/*
<MediaModalSelectedFiles 
  files={[
    { 
      name: 'example.jpg', 
      type: 'image/jpeg', 
      size: 102456, 
      preview: 'https://example.com/example.jpg' 
    },
    { 
      name: 'document.pdf', 
      type: 'application/pdf', 
      size: 204800 
    }
  ]}
  onRemove={(index) => console.log('Remove file at index:', index)}
  onInsert={(files) => console.log('Insert files:', files)}
  onClearAll={() => console.log('Clear all files')}
/>
*/

export default MediaModalSelectedFiles;