"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export default function DocumentArchiveDialog({ open, loading, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Archivar documento</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Archivar este documento lo ocultará de los listados activos, pero se mantendrá para trazabilidad.
        </DialogContentText>
        <TextField
          label="Motivo (opcional)"
          size="small"
          fullWidth
          multiline
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="warning" variant="contained" disabled={loading}>
          {loading ? "Archivando…" : "Archivar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
