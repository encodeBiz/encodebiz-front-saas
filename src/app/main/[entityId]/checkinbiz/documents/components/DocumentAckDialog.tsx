"use client";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  loading: boolean;
  documentTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DocumentAckDialog({ open, loading, documentTitle, onClose, onConfirm }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Acuse de recibo</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Está a punto de confirmar la recepción del documento: <strong>{documentTitle}</strong>
        </DialogContentText>
        <FormControlLabel
          control={<Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />}
          label="Confirmo que he recibido y revisado este documento."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={loading || !confirmed}>
          {loading ? "Confirmando…" : "Confirmar acuse"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
