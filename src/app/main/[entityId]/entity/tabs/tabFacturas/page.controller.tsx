/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCallback, useEffect, useState } from 'react';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { fetchInvoicesByEntity } from '@/services/common/subscription.service';
import { buildSearch, Column, IRowAction } from '@/components/common/table/GenericTable';
import { useToast } from '@/hooks/useToast';
import { StripeInvoice } from '@/domain/auth/ISubscription';
import { Download, DownloadOutlined } from '@mui/icons-material';


interface IFilterParams {

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

export const useFacturaController = () => {
    const t = useTranslations();
    const { currentEntity } = useEntity()
    const { showToast } = useToast()
    /** Filter and PAgination Control */
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<StripeInvoice[]>([]);
    const [itemsHistory, setItemsHistory] = useState<StripeInvoice[]>([]);
    const [filterParams, setFilterParams] = useState<IFilterParams>({
        startAfter: null,
        currentPage: 0,
        total: 0,
        params: {
            filters: [],
            startAfter: null,
            limit: 5,
            orderBy: 'createdAt',
            orderDirection: 'desc',
        }
    })
    /** Filter and PAgination Control */


    const rowAction: Array<IRowAction> = [
        {
            actionBtn: true,
            color: 'error',
            icon: <DownloadOutlined color="primary" />,
            label: t('core.button.download'),
            allowItem: () => true,
            showBulk: false,
            onPress: (item: StripeInvoice) => { },
            bulk: false
        },

    ]

    /** Paginated Changed */
    const onBack = (): void => {
        const backSize = items.length
        itemsHistory.splice(-backSize)
        setItemsHistory([...itemsHistory])
        setItems([...itemsHistory.slice(-filterParams.params.limit)])
        setFilterParams({ ...filterParams, currentPage: filterParams.currentPage - 1, params: { ...filterParams.params, startAfter: (itemsHistory[itemsHistory.length - 1] as any).last } })

    }

    /** Paginated Changed */
    const onNext = async (): Promise<void> => {
        setLoading(true)
        const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: filterParams.currentPage + 1 }
        fetchingData(filterParamsUpdated)
    }

    /** Sort Change */
    const onSort = (sort: { orderBy: string, orderDirection: 'desc' | 'asc' }) => {
        const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, ...sort, startAfter: null, } }
        setFilterParams(filterParamsUpdated)
        fetchingData(filterParamsUpdated)
    }


    /** Limit Change */
    const onRowsPerPageChange = (limit: number) => {
        const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, limit } }
        setFilterParams(filterParamsUpdated)
        fetchingData(filterParamsUpdated)
    }


    /** Filter Changed */
    const onFilter = () => {

    }


    const columns: Column<StripeInvoice>[] = [
        {
            id: 'service',
            label: t("core.label.service"),
            minWidth: 170
        },
        {
            id: 'date',
            label: t("core.label.date"),
            minWidth: 170
        },
        {
            id: 'price',
            label: t("core.label.price"),
            minWidth: 170
        },
        {
            id: 'status',
            label: t("core.label.status"),
            minWidth: 170
        },
    ];

    const fetchingData = (filterParams: IFilterParams) => {
        setLoading(true)
        fetchInvoicesByEntity(currentEntity?.entity.id as string, { ...(filterParams.params as any) }).then(async res => {
            if (res.length !== 0) {
                setFilterParams({ ...filterParams, params: { ...filterParams.params, startAfter: res.length > 0 ? (res[res.length - 1] as any).last : null } })
                setItems(res)
                if (!filterParams.params.startAfter) {
                    setItemsHistory([...res])
                } else {
                    setItemsHistory(prev => [...prev, ...res])
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

    useEffect(() => {
        if (currentEntity?.entity?.id) {
            fetchingData(filterParams)
        }
    }, [currentEntity?.entity?.id])




    return {
        items, onSort, onRowsPerPageChange,
        onNext, onBack,
        columns, rowAction,
        loading, filterParams,
    }
}

