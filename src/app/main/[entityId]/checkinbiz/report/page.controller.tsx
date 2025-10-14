/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/useToast";
import { useEntity } from "@/hooks/useEntity";
import { searchLogs, fetchEmployee as fetchEmployeeData } from "@/services/checkinbiz/employee.service";
import { IChecklog } from "@/domain/features/checkinbiz/IChecklog";
import { Column } from "@/components/common/table/GenericTable";
import { format_date, rmNDay } from "@/lib/common/Date";
import { fetchSucursal as fetchSucursalData } from "@/services/checkinbiz/sucursal.service";

import { Box } from "@mui/material";

import { DateRangePicker } from "@/app/main/[entityId]/passinbiz/stats/components/filters/fields/DateRangeFilter";
import { useLayout } from "@/hooks/useLayout";
import SearchFilter from "@/components/common/table/filters/SearchFilter";
import SearchIndexFilter from "@/components/common/table/filters/SearchIndexInput";
import { ISearchIndex } from "@/domain/core/SearchIndex";
import { CustomChip } from "@/components/common/table/CustomChip";
 
interface IFilterParams {
  filter: { branchId: 'none', employeeId: 'none', status: 'valid', range: { start: any, end: any } | null },
  params: {
    orderBy: string,
    orderDirection: 'desc' | 'asc',
    startAfter: any,
    limit: number,
    filters: Array<{
      field: string;
      operator: | '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in'
      value: any;
    }>
  }
  total: number
  currentPage: number
  startAfter: string | null,
}
export default function useAttendanceController() {
  const t = useTranslations();
  const { showToast } = useToast()
  const { currentEntity, watchServiceAccess } = useEntity()
  const { changeLoaderState } = useLayout()

  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IChecklog[]>([]);
  const [itemsHistory, setItemsHistory] = useState<IChecklog[]>([]);
  const [filterParams, setFilterParams] = useState<any>({
    filter: { branchId: 'none', employeeId: 'none', status: 'valid', range: { start: rmNDay(new Date(), 1), end: new Date() } },
    startAfter: null,
    currentPage: 0,
    total: 0,
    params: {
      filters: [
        { field: 'status', operator: '==', value: 'valid' },
        { field: 'timestamp', operator: '>=', value: rmNDay(new Date(), 1) },
        { field: 'timestamp', operator: '<=', value: new Date() }
      ],
      startAfter: null,
      limit: 5,
      orderBy: 'timestamp',
      orderDirection: 'desc',
    }
  })

  /** Paginated Changed */
  const onBack = (): void => {
    const backSize = items.length
    itemsHistory.splice(-backSize)
    setItemsHistory([...itemsHistory])
    setItems([...itemsHistory.slice(-filterParams.params.limit)])
    setFilterParams({ ...filterParams, currentPage: filterParams.currentPage - 1, params: { ...filterParams.params, startAfter: (itemsHistory[itemsHistory.length - 1] as any).last } })

  }

   

  const rowAction: Array<any> = []

  /** Paginated Changed */
  const onNext = async (): Promise<void> => {
    setLoading(true)
    const filterParamsUpdated: any = { ...filterParams, currentPage: filterParams.currentPage + 1 }
    fetchingData(filterParamsUpdated)
  }



  /** Sort Change */
  const onSort = (sort: { orderBy: string, orderDirection: 'desc' | 'asc' }) => {
    const filterParamsUpdated: any = { ...filterParams, currentPage: 0, params: { ...filterParams.params, ...sort, startAfter: null, } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }


  /** Limit Change */
  const onRowsPerPageChange = (limit: number) => {
    const filterParamsUpdated: any = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, limit } }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }



  const fetchingData = (filterParams: IFilterParams) => {

    if (filterParams.params.filters.find((e: any) => e.field === 'branchId' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "branchId")

    if (filterParams.params.filters.find((e: any) => e.field === "employeeId" && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "employeeId")

    if (filterParams.params.filters.find((e: any) => e.field === "employeeId" && !e.value))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "employeeId")
    const filters = [
      ...filterParams.params.filters,
    ]
    setLoading(true)



    searchLogs(currentEntity?.entity.id as string, { ...(filterParams.params as any), filters }).then(async res => {

      if (res.length !== 0) {
        setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: res.length > 0 ? (res[res.length - 1] as any).last : null } })

        const data: Array<IChecklog> = await Promise.all(
          res.map(async (item) => {
            const branchId = (await fetchSucursalData(currentEntity?.entity.id as string, item.branchId as string))?.name
            const employeeId = (await fetchEmployeeData(currentEntity?.entity.id as string, item.employeeId as string))?.fullName
            return { ...item, branchId, employeeId };
          })
        );

        setItems(data)
        if (!filterParams.params.startAfter) {
          setItemsHistory([...data])
        } else {
          setItemsHistory(prev => [...prev, ...data])
        }
      }

      if (!filterParams.params.startAfter && res.length === 0) {
        setItems([])
        setItemsHistory([])
      }

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      setLoading(false)
    })
  }


  const columns: Column<IChecklog>[] = [
    {
      id: 'branchId',
      label: t("core.label.branch"),
      minWidth: 170,
      format: (value, row) => row.branchId
    },
    {
      id: 'employeeId',
      label: t("core.label.employee"),
      minWidth: 170,
      format: (value, row) => row.employeeId
    },
    {
      id: 'type',
      label: t("core.label.register"),
      minWidth: 170,
      format: (value, row) => t('core.label.' + row.type)
    },
    {
      id: 'status',
      label: t("core.label.status"),
      minWidth: 170,
      format: (value, row) => <CustomChip label={t('core.label.' + row.status)} />
    },
    {
      id: 'timestamp',
      label: t("core.label.date-hour"),
      minWidth: 170,
      format: (value, row) => <>{format_date(row.timestamp, 'DD/MM/YYYY')} {format_date(row.timestamp, 'hh:mm')}</>
    },



  ];





  useEffect(() => {
    if (currentEntity?.entity?.id) {
      fetchingData(filterParams)

    }
  }, [currentEntity?.entity?.id])





 
 


  function exportToCSV(data: Array<IChecklog>, headersMap = null, filename = 'data.csv') {
    if (!data.length) return;

    // Use custom headers or object keys
    const headers = headersMap ? Object.keys(headersMap) : Object.keys(data[0]);
    const headerLabels = headersMap ? Object.values(headersMap) : headers;

    let csvContent = headerLabels.join(',') + '\n';

    data.forEach((row: any) => {
      const values = headers.map(header => {
        let value = row[header] !== undefined ? row[header] : '';
        value = String(value);

        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      });

      csvContent += values.join(',') + '\n';
    });

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  const handleExport = () => {
    if (filterParams.params.filters.find((e: any) => e.field === 'branchId' && e.value === 'none'))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "branchId")

    if (filterParams.params.filters.find((e: any) => e.field === "employeeId" && !e.value))
      filterParams.params.filters = filterParams.params.filters.filter((e: any) => e.field !== "employeeId")

    const filters = [
      ...filterParams.params.filters,
    ]
    changeLoaderState({ show: true, args: { text: t('core.title.loaderAction') } })


    searchLogs(currentEntity?.entity.id as string, { ...(filterParams.params as any), filters, limit: 10000 }).then(async res => {

      const data: Array<any> = await Promise.all(
        res.map(async (item) => {
          const branchId = (await fetchSucursalData(currentEntity?.entity.id as string, item.branchId as string))?.name
          const employeeId = (await fetchEmployeeData(currentEntity?.entity.id as string, item.employeeId as string))?.fullName
          return {

            date: format_date(item.timestamp, 'DD/MM/YYYY'),
            time: format_date(item.timestamp, 'hh:mm'),
            type: t('core.label.' + item.type),
            branchId,
            employeeId
          };
        })
      );

      const headersMap: any = {
        branchId: t('core.label.sucursal'),
        employeeId: t('core.label.employee'),
        type: t('core.label.register'),
        date: t('core.label.date'),
        time: t('core.label.time'),
      };

      exportToCSV(data, headersMap)

    }).catch(e => {
      showToast(e?.message, 'error')
    }).finally(() => {
      changeLoaderState({ show: false })
    })
  }


  useEffect(() => {
    if (currentEntity?.entity?.id) {
      watchServiceAccess('checkinbiz')
    }
  }, [currentEntity?.entity?.id])

  const onSuccessCreate = () => {
const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null} }
    setFilterParams(filterParamsUpdated)
    fetchingData(filterParamsUpdated)
  }

  return {
    items, onSort, onRowsPerPageChange,
     handleExport,
    onNext, onBack,onSuccessCreate,
    columns, rowAction,
    loading, filterParams
  }
}