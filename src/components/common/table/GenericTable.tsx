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
  Typography
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import firebase from "firebase/compat/app";

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
  label?: string
  onPress: (row: any) => void,
  allowItem: (row: any) => boolean,
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
  onDelete?: (ids: (string | number)[]) => void;
  onEdit?: (row: T) => void;
  onBulkAction?: (ids: (string | number)[]) => void;
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  onSorteable?: (sort: { field: string, order: 'desc' | 'asc' }) => void;
  sort?: { field: string, order: 'desc' | 'asc' }
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
  const [order, setOrder] = useState<'asc' | 'desc'>(sort?.order ?? 'asc');
  const [orderBy, setOrderBy] = useState<keyof T>(sort?.field ?? keyField);
  const [selected, setSelected] = useState<(string | number)[]>([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText] = useState('');

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
      onSorteable({ field: property as string, order: isAsc ? 'desc' : 'asc' });
    }

  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = sortedData.map((row) => row[keyField]);
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

  const handleCheckboxClick = (event: React.MouseEvent, id: string | number) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected: (string | number)[] = [];

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
    setRowsPerPage(newLimit);
  };

  const isSelected = (id: string | number) => selected.indexOf(id) !== -1;




  useEffect(() => {
    if (data.length !== 0) setTotalItems(data[0].totalItems);
  }, [data]);

  useEffect(() => {
    if (typeof onRowsPerPageChange === 'function')
      onRowsPerPageChange(rowsPerPage)
  }, [onRowsPerPageChange, rowsPerPage]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2
        }}
      >
        {title && <Typography variant="h6">{title}</Typography>}

        {topFilter}
      </Box>

      {selected.length > 0 && (
        <Box sx={{ p: 1, bgcolor: 'action.selected', display: 'flex', gap: 1 }}>
          <Typography sx={{ flex: 1, alignSelf: 'center' }}>
            {selected.length} selected
          </Typography>
          {rowAction.map((e, i) => {
            if (e.allowItem(e as any))
              return (<Tooltip key={i} title={e.label}>
                <IconButton onClick={() => e.onPress(selected as any)}>
                  {e.icon}
                </IconButton>
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
          <TableHead>
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

              {(onEdit || onDelete) && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row) => {
                const isItemSelected = isSelected(row[keyField]);
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
                          onClick={(event) => handleCheckboxClick(event, row[keyField])}
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
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>


                        {rowAction.map((e, i) => {
                          if (e.allowItem(row as any))
                            return (<Tooltip key={i} title={e.label}>
                              <IconButton onClick={() => e.onPress(row)}>
                                {e.icon}
                              </IconButton>
                            </Tooltip>)
                          else return null
                        })}

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
        rowsPerPage={rowsPerPage}
        page={page as number}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}