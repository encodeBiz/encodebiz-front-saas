import React, { useRef, useState } from 'react';
import {
  Box,
 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import { CloudUploadOutlined } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { CustomIconBtn } from '@/components/icons/CustomIconBtn';
import { CustomTypography } from '../Text/CustomTypography';
import { SassButton } from '../buttons/GenericButton';
// Use public URL for static assets in Next.js
import image from '../../../../public/assets/images/scv.png'
import Image from 'next/image';
const HOLDER_USUARIOS_TYPE_CREDENTIAL_URL = '/holder_usuarios_type_credential.csv';
interface ICSVUploadModal {
  open: boolean
  onClose: () => void
  onConfirm: (file: File | null) => void
}
const CSVUploadModal = ({ open, onClose, onConfirm }: ICSVUploadModal) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>([]);
  const [headers, setHeaders] = useState([]);
  const t = useTranslations()
  const theme = useTheme()
  const uploadRef = useRef(null)
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Read the file content
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result as string;
      parseCSV(content);
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (csvString: string) => {
    const lines: any = csvString.split('\n');
    const headers: any = lines[0].split(',').map((header: string) => header.trim());
    const data: any = [];

    // Process up to 5 rows for preview
    const previewRowCount = Math.min(5, lines.length - 1);
    for (let i = 1; i <= previewRowCount; i++) {
      if (lines[i].trim() === '') continue;
      const values = lines[i].split(',');
      const row: Record<string, any> = {};
      headers.forEach((header: string, index: number) => {
        row[header] = values[index] ? values[index].trim() : '';
      });
      data.push(row);
    }

    setHeaders(headers);
    if (data)
      setPreviewData(data);
  };

  const handleConfirm = () => {
    onConfirm(file);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setHeaders([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth slotProps={{ paper: { sx: { p: 2, borderRadius: 2 } } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}>
          <Typography variant='h5'>{t('holders.importSCVTitle')}</Typography>
          <Typography variant='body1'>
            {t('holders.desc1')} <br />
            {t('holders.desc2')} <span style={{ color: theme.palette.primary.main }}>(fullName, email, phoneNumber)</span>
            {t('holders.desc3')} <span style={{ color: theme.palette.primary.main }}>auxiliaryFields-[{t('holders.desc4')}].</span>
          </Typography>
          <Typography sx={{ mt: 1 }} variant='body1'> {t('holders.desc5')}</Typography>
        </Box>
        <CustomIconBtn
          onClick={handleClose}
          color={theme.palette.primary.main}
        />
      </DialogTitle>
      <DialogContent>
        {!file ? (
          <Box display={'flex'} flexDirection={{
            sx: 'column',
            sm: 'column',
            md: 'column',
            lg: 'row',
            xl: 'row',
          }} alignItems={'center'} justifyContent={'center'} gap={4}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={4}>
              <Paper onClick={() => { }}
                variant="outlined"
                sx={{
                  position: 'relative',
                  width: 573,
                  height: 242,
                  border: '2px dashed #476BE7',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 84, 202, 0.08)',
                  cursor: 'pointer',
                  opacity: 1,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: '#476BE7',
                    backgroundColor: 'rgba(0, 84, 202, 0.16)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    p: 2
                  }}
                >
                  <CustomTypography> {t('holders.desc6')}</CustomTypography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    {t('holders.desc7')}
                  </Typography>
                  <input
                    ref={uploadRef}
                    accept=".csv"
                    style={{ display: 'none' }}
                    id="csv-upload"
                    type="file"
                    onChange={handleFileChange}
                  />

                  <SassButton
                    startIcon={<CloudUploadOutlined />}
                    variant='contained'
                    color='primary'
                    onClick={() => {
                      if (uploadRef.current) {
                        (uploadRef.current as any).click()
                      }
                    }}
                  >
                    {t('holders.importSCVTitle')}
                  </SassButton>

                </Box>
              </Paper>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} gap={1}>

                <Typography variant="body1" textAlign="center">
                  {t('holders.desc8')}
                </Typography>
                <SassButton
            
                  variant='outlined'
                  color='inherit'
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_URI}${HOLDER_USUARIOS_TYPE_CREDENTIAL_URL}`, '_blank')}
                >
                  {t('holders.btn')}
                </SassButton>
              </Box>
            </Box>
            <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'} justifyContent={'flex-start'} gap={4}>
              <CustomTypography> {t('holders.desc9')}</CustomTypography>
              <Image
                src={image}
                width={459}
                height={339}
                alt='Image'
              />
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" >
              {t('core.upload.file')}: {file.name}
            </Typography>
            <Typography variant="body2" >
              {t('core.upload.preview')}:
            </Typography>
            <TableContainer component={Paper} style={{ marginTop: '10px' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableCell key={header}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((row: { [x: string]: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
                    <TableRow key={index}>
                      {headers.map((header) => (
                        <TableCell key={`${index}-${header}`}>
                          {row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>

        <SassButton
          onClick={handleConfirm}
          color="primary"
          disabled={!file}
          size='small'
          variant="contained"
        
        >
          {t('core.button.confirmSCV')}
        </SassButton>
      </DialogActions>
    </Dialog>
  );
};

export default CSVUploadModal;
