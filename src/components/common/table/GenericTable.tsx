"use client"
import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  TablePagination,
  IconButton,
  Tooltip,
  Box,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  SettingsOutlined
} from '@mui/icons-material';
import firebase from "firebase/compat/app";
import { useTranslations } from 'next-intl';
import { SassButton } from '../buttons/GenericButton';

export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface IRowAction {
  icon: any
  color?: "inherit" | "error" | "primary" | "secondary" | "info" | "success" | "warning"
  actionBtn?: React.ReactNode,
  label?: string
  onPress: (row: any) => void,
  allowItem: (row: any) => boolean,
  bulk?: boolean
}

export const buildSearch = (term: string): Array<{
  field: string;
  operator: firebase.firestore.WhereFilterOp;
  value: any;
}> => {
  const filters: Array<{
    field: string;
    operator: firebase.firestore.WhereFilterOp;
    value: any;
  }> = []
  const fieldSearch = ['name']
  if (term) {
    fieldSearch.forEach(field => {
      filters.push({
        field: field,
        operator: '==',
        value: term
      })
    });
  }
  return filters
}


interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  title?: string;
  selectable?: boolean;
  onRowClick?: (row: T) => void;
  onDelete?: (ids: T[]) => void;
  onEdit?: (row: T) => void;
  onBulkAction?: (ids: T[]) => void;
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  onSorteable?: (sort: { orderBy: string, orderDirection: 'desc' | 'asc' }) => void;
  sort?: { orderBy: string, orderDirection: 'desc' | 'asc' }
  onBack: () => void
  onNext: () => void
  onSearch?: (text: string) => void
  rowAction?: Array<IRowAction>
  topFilter?: React.ReactNode
}

export function GenericTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  title,
  page,
  rowsPerPage,
  selectable = false,
  onRowClick,
  onDelete,
  onEdit,
  onBulkAction,
  loading = false,
  onRowsPerPageChange,
  onSorteable,
  sort,
  onBack,
  onNext,
  rowAction = [],
  topFilter = <></>
}: GenericTableProps<T>) {
  // State management
  const [order, setOrder] = useState<'asc' | 'desc'>(sort?.orderDirection ?? 'asc');
  const [orderBy, setOrderBy] = useState<keyof T>(sort?.orderBy ?? keyField);
  const [selected, setSelected] = useState<T[]>([]);
  const t = useTranslations()
  const [anchorEl, setAnchorEl] = React.useState<{ target: null | HTMLElement, key: string }>({ target: null, key: '' });
  const open = Boolean(anchorEl?.target);
  const openRowMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl({ target: event.currentTarget, key: id });
  };
  const closeRowMenu = () => {
    setAnchorEl({ target: null, key: '' });
  };
  const [totalItems, setTotalItems] = useState(0);
  const [searchText] = useState('');
  const theme = useTheme()

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.id];
        return value?.toString().toLowerCase().includes(searchText.toLowerCase());
      })
    );
  }, [searchText, data, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue === bValue) return 0;
      if (aValue == null) return order === 'asc' ? -1 : 1;
      if (bValue == null) return order === 'asc' ? 1 : -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return order === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
  }, [filteredData, order, orderBy]);

  // Handlers
  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    if (typeof onSorteable === 'function') {
      onSorteable({ orderBy: property as string, orderDirection: isAsc ? 'desc' : 'asc' });
    }

  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = sortedData.map((row) => row);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleCheckboxClick = (event: React.MouseEvent, id: T) => {
    event.stopPropagation();
    const selectedIndex = selected.findIndex(e => e[keyField] === id[keyField])
    let newSelected: T[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: any, newPage: number) => {
    if (newPage > (page as number)) onNext()
    else onBack()

  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    if (typeof onRowsPerPageChange === 'function')
      onRowsPerPageChange(newLimit);
  };

  const isSelected = (id: T) => selected.findIndex(e => e[keyField] === id[keyField]) !== -1;




  useEffect(() => {
    if (data.length !== 0) setTotalItems(data[0].totalItems);
  }, [data]);



  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 2
        }}
      >
        {title && <Typography variant="h6">{title}</Typography>}

        {topFilter}
      </Box>

      {selected.length > 0 && (
        <Box sx={{ p: 1,px:3, bgcolor: 'primary.light', display: 'flex', gap: 1 }}>
          <Typography sx={{ flex: 1, alignSelf: 'center' }}>
            {selected.length} {t('core.table.selected')}
          </Typography>
          {rowAction.map((e, i) => {
            if (e.allowItem(e as any) && e.bulk)
              return (<Tooltip key={i} title={e.label}>
                <SassButton startIcon={e.icon} color={e.color} variant='outlined' onClick={() => e.onPress(selected as T[])}>
                  {e.label}
                </SassButton>
              </Tooltip>)
            else return null
          })}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton onClick={() => onDelete(selected)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          )}
          {onBulkAction && (
            <Tooltip title="Bulk action">
              <IconButton onClick={() => onBulkAction(selected)}>
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table" size="medium">
          <TableHead >
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < sortedData.length}
                    checked={sortedData.length > 0 && selected.length === sortedData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}

              {columns.map((column) => (
                <TableCell
                  sx={{
                    '&.MuiTableCell-head': {
                      backgroundColor: theme.palette.common.white,
                      fontWeight: 'bold',
                    },
                  }}
                  variant='head'
                  key={column.id as string}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {(onEdit || onDelete || rowAction.length > 0) && (
                <TableCell
                  sx={{
                    '&.MuiTableCell-head': {
                      backgroundColor: theme.palette.common.white,
                      fontWeight: 'bold',
                      textAlign: 'left'
                    },
                  }}
                  variant='head'
                  align="right">{t('core.table.actions')}</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  {t('core.table.loader')}
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">

                  {t('core.table.nodata')}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row) => {
                const isItemSelected = isSelected(row);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row[keyField]}
                    selected={isItemSelected}
                    onClick={() => handleClick(row)}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) => handleCheckboxClick(event, row)}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id as string} align={column.align}>
                          {column.format ? column.format(value, row) : value}
                        </TableCell>
                      );
                    })}

                    {(onEdit || onDelete || rowAction.length > 0) && (
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap', gap: 2, display: 'flex', flexDirection: 'row' }}>

                        {rowAction.length > 0 && <>
                          <SassButton startIcon={<SettingsOutlined />} color='primary' variant='outlined' onClick={(e) => openRowMenu(e, row.id)}>
                            {t('core.table.actions')}
                          </SassButton>

                          {anchorEl.key === row.id && <Menu
                            anchorEl={anchorEl.target}
                            id="account-menu"
                            open={open}
                            onClose={closeRowMenu}
                            onClick={closeRowMenu}
                            slotProps={{
                              paper: {
                                sx: {
                                  borderRadius: 2,
                                  px: 1
                                }
                              }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                          >
                            {rowAction.map((e, i) => <MenuItem sx={{ display: e.allowItem(row) ? 'flex' : 'none' }} key={i} onClick={() => {
                              closeRowMenu()
                              e.onPress(row)
                            }}> <ListItemIcon color={e.color}>{e.icon}</ListItemIcon>
                              <Typography color={e.color}>{e.label}</Typography>
                            </MenuItem>)}

                          </Menu>}</>}



                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(row);
                              }}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}


                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete([row[keyField]]);
                              }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination

        rowsPerPageOptions={[2, 5, 10, 25, 100]}
        component="div"
        count={totalItems}
        rowsPerPage={rowsPerPage ?? 5}
        page={page as number}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}

        labelRowsPerPage={t('core.table.rowsPerPage')}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${t('core.table.of')} ${count}`
        }
        slotProps={{
          select: {
            inputProps: { 'aria-label': t('core.table.rowsPerPage') },
            native: true,
          },
          actions: {
            previousButton: {
              'aria-label': t('core.table.previous'),
            },
            nextButton: {
              'aria-label': t('core.table.next'),
            }
          }

        }}



      />
    </Paper >
  );
}

