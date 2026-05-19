"use client";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import {
  AcknowledgementMode,
  DocumentScope,
  DocumentType,
  DocumentVisibilityRole,
} from "@/domain/features/checkinbiz/IDocument";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  DOCUMENT_SCOPE_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
  DOCUMENT_VISIBILITY_ROLES,
  DOCUMENT_ROLE_LABELS,
  MAX_FILE_SIZE_BYTES,
  formatFileSize,
} from "./documentUi";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";

export interface DocumentUploadFormValues {
  scope: DocumentScope;
  type: DocumentType;
  title: string;
  description: string;
  branchId: string;
  employeeId: string;
  visibleToRoles: DocumentVisibilityRole[];
  requiresAcknowledgement: boolean;
  expiresAt: string;
  externalRef: string;
  tags: string;
  file: File | null;
}

const INITIAL_VALUES: DocumentUploadFormValues = {
  scope: "entity",
  type: "other",
  title: "",
  description: "",
  branchId: "",
  employeeId: "",
  visibleToRoles: ["worker", "supervisor", "manager"],
  requiresAcknowledgement: false,
  expiresAt: "",
  externalRef: "",
  tags: "",
  file: null,
};

interface Props {
  open: boolean;
  loading: boolean;
  defaultScope?: DocumentScope;
  defaultBranchId?: string;
  defaultEmployeeId?: string;
  onClose: () => void;
  onSubmit: (values: DocumentUploadFormValues) => void;
}

export default function DocumentUploadModal({
  open,
  loading,
  defaultScope,
  defaultBranchId,
  defaultEmployeeId,
  onClose,
  onSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<DocumentUploadFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentUploadFormValues, string>>>({});

  useEffect(() => {
    if (open) {
      setValues({
        ...INITIAL_VALUES,
        scope: defaultScope ?? "entity",
        branchId: defaultBranchId ?? "",
        employeeId: defaultEmployeeId ?? "",
      });
      setErrors({});
    }
  }, [open, defaultScope, defaultBranchId, defaultEmployeeId]);

  const set = (field: keyof DocumentUploadFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleRole = (role: DocumentVisibilityRole) => {
    setValues((prev) => {
      const has = prev.visibleToRoles.includes(role);
      return {
        ...prev,
        visibleToRoles: has ? prev.visibleToRoles.filter((r) => r !== role) : [...prev.visibleToRoles, role],
      };
    });
    setErrors((prev) => ({ ...prev, visibleToRoles: undefined }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: "Formato no permitido (PDF, JPG, PNG, WEBP, DOC, DOCX, XLS, XLSX)" }));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({ ...prev, file: "El archivo supera el máximo de 10 MB" }));
      return;
    }
    set("file", file);
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!values.title.trim()) next.title = "El título es obligatorio";
    if (!values.file) next.file = "Debes seleccionar un archivo";
    if (values.visibleToRoles.length === 0) next.visibleToRoles = "Selecciona al menos un rol";
    if (values.scope === "branch" && !values.branchId) next.branchId = "La sucursal/proyecto es obligatoria";
    if (values.scope === "employee") {
      if (!values.branchId) next.branchId = "El contexto de sucursal/proyecto es obligatorio";
      if (!values.employeeId) next.employeeId = "El empleado es obligatorio";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(values);
  };

  const ackMode: AcknowledgementMode | undefined =
    values.scope === "employee" ? "single_employee" : values.scope === "branch" ? "branch_employees" : undefined;

  const isEntityScope = values.scope === "entity";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Subir documento</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Ámbito</InputLabel>
            <Select
              value={values.scope}
              label="Ámbito"
              onChange={(e) => set("scope", e.target.value as DocumentScope)}
              disabled={!!defaultScope}
            >
              {DOCUMENT_SCOPE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(values.scope === "branch" || values.scope === "employee") && (
            <Box>
              <SearchIndexFilter
                width="100%"
                type="branch"
                label="Sucursal / Proyecto"
                onChange={(item: ISearchIndex) => {
                  const id = item?.index?.split("/").pop() ?? "";
                  set("branchId", id);
                }}
              />
              {errors.branchId && <FormHelperText error>{errors.branchId}</FormHelperText>}
            </Box>
          )}

          {values.scope === "employee" && (
            <Box>
              <SearchIndexFilter
                width="100%"
                type="employee"
                label="Empleado"
                onChange={(item: ISearchIndex) => {
                  const id = item?.index?.split("/").pop() ?? "";
                  set("employeeId", id);
                }}
              />
              {errors.employeeId && <FormHelperText error>{errors.employeeId}</FormHelperText>}
            </Box>
          )}

          <FormControl fullWidth size="small">
            <InputLabel>Tipo documental</InputLabel>
            <Select
              value={values.type}
              label="Tipo documental"
              onChange={(e) => set("type", e.target.value as DocumentType)}
            >
              {DOCUMENT_TYPE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Título"
            size="small"
            fullWidth
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            label="Descripción (opcional)"
            size="small"
            fullWidth
            multiline
            rows={2}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />

          <FormControl component="fieldset" error={!!errors.visibleToRoles}>
            <FormLabel component="legend" sx={{ fontSize: 13 }}>
              Visible para
            </FormLabel>
            <FormGroup row>
              {DOCUMENT_VISIBILITY_ROLES.map((role) => (
                <FormControlLabel
                  key={role}
                  control={
                    <Checkbox
                      size="small"
                      checked={values.visibleToRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                    />
                  }
                  label={DOCUMENT_ROLE_LABELS[role]}
                />
              ))}
            </FormGroup>
            {errors.visibleToRoles && <FormHelperText>{errors.visibleToRoles}</FormHelperText>}
          </FormControl>

          {!isEntityScope && (
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={values.requiresAcknowledgement}
                  onChange={(e) => set("requiresAcknowledgement", e.target.checked)}
                />
              }
              label={`Requiere acuse de recibo${ackMode === "branch_employees" ? " (todos los empleados de la sucursal)" : ""}`}
            />
          )}

          <TextField
            label="Fecha de vencimiento (opcional)"
            size="small"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={values.expiresAt}
            onChange={(e) => set("expiresAt", e.target.value)}
          />

          <Box>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_EXTENSIONS}
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              size="small"
              fullWidth
            >
              {values.file ? values.file.name : "Seleccionar archivo"}
            </Button>
            {values.file && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {formatFileSize(values.file.size)}
              </Typography>
            )}
            {errors.file && <FormHelperText error>{errors.file}</FormHelperText>}
            <FormHelperText>PDF, JPG, PNG, WEBP, DOC, DOCX, XLS, XLSX — máx. 10 MB</FormHelperText>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Subiendo…" : "Subir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
