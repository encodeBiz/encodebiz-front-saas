import React, { useState } from 'react';
import {
  Button,
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
  Typography
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
interface ICSVUploadModal {
  open: boolean
  onClose: () => void
  onConfirm: (file: File | null, previewData: any) => void
}
const CSVUploadModal = ({ open, onClose, onConfirm }: ICSVUploadModal) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any>({});
  const [headers, setHeaders] = useState([]);
  const t = useTranslations()
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
      const row: Record<string,any> = {};
      headers.forEach((header: string, index: number) => {
        row[header] = values[index] ? values[index].trim() : '';
      });
      data.push(row);
    }

    setHeaders(headers);
    setPreviewData(data);
  };

  const handleConfirm = () => {
    onConfirm(file, previewData);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setHeaders([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('core.upload.title')}</DialogTitle>
      <DialogContent>
        {!file ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <input
              accept=".csv"
              style={{ display: 'none' }}
              id="csv-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="csv-upload">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<CloudUpload />}
              >
                {t('core.upload.btn')}
              </Button>
            </label>
            <Typography variant="body2" style={{ marginTop: '10px' }}>
              {t('core.upload.desc')}
            </Typography>
          </div>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              {t('core.upload.file')}: {file.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
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
        <Button onClick={handleClose} color="secondary">
          {t('core.button.cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          disabled={!file}
          variant="contained"
        >
          {t('core.button.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVUploadModal;


/*

import React, { useState } from 'react';
import { Button } from '@mui/material';
import CSVUploadModal from './CSVUploadModal';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleUploadConfirm = (file, previewData) => {
    console.log('File to upload:', file.name);
    console.log('Preview data:', previewData);
    // Here you would typically send the file to your server
    // or process it further
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
      >
        Upload CSV
      </Button>
      
      <CSVUploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleUploadConfirm}
      />
    </div>
  );
};

export default App;
*/