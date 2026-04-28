/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Column, IRowAction } from "@/components/common/table/GenericTable";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { SearchParams } from "@/domain/core/firebase/firestore";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { Task, TaskPriority, TaskStatus, defaultTaskConfig } from "@/domain/features/checkinbiz/ITask";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { format_date_with_locale } from "@/lib/common/Date";
import { createTask, searchTasks } from "@/services/checkinbiz/task.service";
import { VisibilityOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { taskPriorityOptions, taskStatusOptions, TaskChip } from "./components/taskUi";

interface IFilterParams {
  filter: { branchId: string; status: TaskStatus | "all"; priority: TaskPriority | "all"; employeeId: string };
  params: Partial<SearchParams> & {
    orderBy: string;
    orderDirection: "desc" | "asc";
    startAfter: any;
    limit: number;
    filters: SearchParams["filters"];
  };
  currentPage: number;
}

export default function useTasksListController() {
  const { token } = useAuth();
  const { currentEntity, watchServiceAccess } = useEntity();
  const { currentLocale } = useAppLocale();
  const { navivateTo } = useLayout();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<Task[]>([]);
  const [itemsHistory, setItemsHistory] = useState<Task[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    filter: { branchId: "all", status: "all", priority: "all", employeeId: "all" },
    currentPage: 0,
    params: {
      filters: [],
      startAfter: null,
      limit: 8,
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  });

  const rowAction: Array<IRowAction> = [
    {
      actionBtn: true,
      iconOnly: true,
      color: "primary",
      icon: <VisibilityOutlined color="primary" />,
      label: "Detalle",
      bulk: false,
      allowItem: () => true,
      onPress: (item: Task) => onDetail(item),
    },
  ];

  const columns: Column<Task>[] = [
    {
      id: "title",
      label: "Tarea",
      minWidth: 220,
      onClick: (item) => onDetail(item),
    },
    {
      id: "status",
      label: "Estado",
      minWidth: 150,
      format: (_value, row) => <TaskChip value={row.status} />,
    },
    {
      id: "priority",
      label: "Prioridad",
      minWidth: 130,
      format: (_value, row) => <TaskChip value={row.priority ?? "medium"} />,
    },
    {
      id: "assignedEmployeeIds",
      label: "Asignados",
      minWidth: 110,
      format: (_value, row) => row.assignedEmployeeIds?.length ?? 0,
    },
    {
      id: "scheduledStartAt",
      label: "Inicio previsto",
      minWidth: 180,
      format: (_value, row) => (
        <Typography variant="body2" textTransform="capitalize">
          {row.scheduledStartAt ? format_date_with_locale(row.scheduledStartAt, currentLocale as "en" | "es") : "-"}
        </Typography>
      ),
    },
    {
      id: "dueAt",
      label: "Vence",
      minWidth: 180,
      format: (_value, row) => (
        <Typography variant="body2" textTransform="capitalize">
          {format_date_with_locale(row.dueAt, currentLocale as "en" | "es")}
        </Typography>
      ),
    },
  ];

  const fetchingData = async (nextFilterParams: IFilterParams) => {
    if (!currentEntity?.entity.id) return;
    setLoading(true);
    try {
      const data = await searchTasks(currentEntity.entity.id, nextFilterParams.params);
      if (data.length !== 0) {
        setFilterParams({
          ...nextFilterParams,
          params: {
            ...nextFilterParams.params,
            startAfter: data.length > 0 ? (data[data.length - 1] as any).last : null,
          },
        });
        setItems(data);
        if (!nextFilterParams.params.startAfter) setItemsHistory([...data]);
        else setItemsHistory((prev) => [...prev, ...data]);
      }
      if (!nextFilterParams.params.startAfter && data.length === 0) {
        setItems([]);
        setItemsHistory([]);
      }
    } catch (error: any) {
      showToast(error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const buildFilters = (filter: IFilterParams["filter"]) => {
    const filters: SearchParams["filters"] = [];
    if (filter.branchId !== "all") filters.push({ field: "branchId", operator: "==", value: filter.branchId });
    if (filter.status !== "all") filters.push({ field: "status", operator: "==", value: filter.status });
    if (filter.priority !== "all") filters.push({ field: "priority", operator: "==", value: filter.priority });
    if (filter.employeeId !== "all") filters.push({ field: "assignedEmployeeIds", operator: "array-contains", value: filter.employeeId });
    return filters;
  };

  const onFilter = (filter: IFilterParams["filter"]) => {
    const updated = {
      ...filterParams,
      currentPage: 0,
      filter,
      params: { ...filterParams.params, startAfter: null, filters: buildFilters(filter) },
    };
    setFilterParams(updated);
    fetchingData(updated);
  };

  const onBack = () => {
    const backSize = items.length;
    itemsHistory.splice(-backSize);
    setItemsHistory([...itemsHistory]);
    setItems([...itemsHistory.slice(-filterParams.params.limit)]);
    setFilterParams({
      ...filterParams,
      currentPage: filterParams.currentPage - 1,
      params: { ...filterParams.params, startAfter: (itemsHistory[itemsHistory.length - 1] as any)?.last },
    });
  };

  const onNext = () => {
    const updated = { ...filterParams, currentPage: filterParams.currentPage + 1 };
    fetchingData(updated);
  };

  const onRowsPerPageChange = (limit: number) => {
    const updated = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, limit } };
    setFilterParams(updated);
    fetchingData(updated);
  };

  const onSort = (sort: { orderBy: string; orderDirection: "desc" | "asc" }) => {
    const updated = { ...filterParams, currentPage: 0, params: { ...filterParams.params, ...sort, startAfter: null } };
    setFilterParams(updated);
    fetchingData(updated);
  };

  const onDetail = (item: Task) => {
    navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/tasks/${item.id}/detail`);
  };

  const onCreate = async (data: Partial<Task>) => {
    try {
      setSaving(true);
      await createTask(
        {
          ...data,
          entityId: currentEntity?.entity.id,
          config: { ...defaultTaskConfig, ...(data.config ?? {}) },
        },
        token,
        currentLocale
      );
      setOpenForm(false);
      await fetchingData({ ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null } });
      showToast("Operación completada correctamente", "success");
    } catch (error: any) {
      showToast(error?.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const topFilter = useMemo(
    () => (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}>
        <SearchFilter
          label="Estado"
          value={filterParams.filter.status}
          onChange={(value: any) => onFilter({ ...filterParams.filter, status: value })}
          options={taskStatusOptions}
        />
        <SearchFilter
          label="Prioridad"
          value={filterParams.filter.priority}
          onChange={(value: any) => onFilter({ ...filterParams.filter, priority: value })}
          options={taskPriorityOptions}
        />
        <SearchIndexFilter
          width="auto"
          type="branch"
          label="Sucursal"
          onChange={(value: ISearchIndex) => {
            const branchId = value?.index?.split("/").pop() ?? "all";
            onFilter({ ...filterParams.filter, branchId });
          }}
        />
        <SearchIndexFilter
          width="auto"
          type="employee"
          label="Empleado"
          onChange={(value: ISearchIndex) => {
            const employeeId = value?.index?.split("/").pop() ?? "all";
            onFilter({ ...filterParams.filter, employeeId });
          }}
        />
      </Box>
    ),
    [filterParams.filter]
  );

  useEffect(() => {
    if (currentEntity?.entity?.id) watchServiceAccess("checkinbiz");
  }, [currentEntity?.entity?.id, watchServiceAccess]);

  useEffect(() => {
    if (currentEntity?.entity?.id) fetchingData(filterParams);
  }, [currentEntity?.entity?.id]);

  return {
    items,
    rowAction,
    columns,
    loading,
    saving,
    filterParams,
    topFilter,
    openForm,
    setOpenForm,
    onCreate,
    onRowsPerPageChange,
    onSort,
    onNext,
    onBack,
  };
}
