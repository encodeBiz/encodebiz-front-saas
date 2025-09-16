/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { Column, IRowAction } from '@/components/common/table/GenericTable';
import { useToast } from '@/hooks/useToast';
import { IWebHook } from '@/domain/core/integration/IWebHook';
import { deleteWebhook, fetchWebHookByEntity } from '@/services/core/integration.service';
import { Chip } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { DeleteOutline } from '@mui/icons-material';
import { useCommonModal } from '@/hooks/useCommonModal';
import { CommonModalType } from '@/contexts/commonModalContext';


interface IFilterParams {

    params: {
     
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

export const useWebHookTabController = () => {
    const t = useTranslations();
    const { currentEntity } = useEntity()
    const { showToast } = useToast()
    const { token } = useAuth()
    const { openModal } = useCommonModal()
    /** Filter and PAgination Control */
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<IWebHook[]>([]);
    const [itemsHistory, setItemsHistory] = useState<IWebHook[]>([]);
    const [filterParams, setFilterParams] = useState<IFilterParams>({
        startAfter: null,
        currentPage: 0,
        total: 0,

        params: {
            filters: [],
            startAfter: null,
            limit: 5
        }
    })
    /** Filter and PAgination Control */

    const rowAction: Array<IRowAction> = [
        {
            actionBtn: true,
            color: 'error',
            icon: <DeleteOutline color="error" />,
            label: t('core.button.delete'),
            showBulk: true,
            allowItem: () => true,
            onPress: (item: IWebHook) => openModal(CommonModalType.DELETE, { item })
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






    const columns: Column<IWebHook>[] = [
        {
            id: 'subscribedEvents',
            label: t("core.label.subscribedEvents"),
            minWidth: 170,
            

        },
        {
            id: 'url',
            label: t("core.label.urlWebHook"),
            minWidth: 170
        },

        {
            id: 'enabled',
            label: t("core.label.status"),
            minWidth: 170,
            format: (value, row) => <Chip
                size="small"
                label={t(`core.label.${row.enabled ? 'enable' : 'noenable'}`)}
                variant="outlined"
            />,
        },
        
    ];

    const fetchingData = (filterParams: IFilterParams) => {
        setLoading(true)
        fetchWebHookByEntity(currentEntity?.entity.id as string, { ...(filterParams.params as any) }).then(async res => {

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
            setLoading(false)

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


    const [deleting, setDeleting] = useState(false)
    const onDelete = async (item: any) => {
        try {
            setDeleting(true)
            const id = item.id
            await deleteWebhook({
                "endpointId": id,
                "entityId": currentEntity?.entity.id
            }, token)
            setItemsHistory(itemsHistory.filter(e => e.id !== id))
            setItems(itemsHistory.filter(e => e.id !== id))
            setDeleting(false)
        } catch (e: any) {
            showToast(e?.message, 'error')
            setDeleting(false)
        }
    }


    return {
        items,
        onNext, onBack,
        deleting, onDelete,
        columns,rowAction,
        loading, filterParams, onSort, onRowsPerPageChange
    }
}

