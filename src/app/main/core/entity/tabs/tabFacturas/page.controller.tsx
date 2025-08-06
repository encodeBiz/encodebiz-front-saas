'use client'

import { useCallback, useEffect, useState } from 'react';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { fetchInvoicesByEntity } from '@/services/common/subscription.service';
import { buildSearch, Column } from '@/components/common/table/GenericTable';
import { useToast } from '@/hooks/useToast';
import { Box } from '@mui/material';
import { useStyles } from './page.styles';
import { PictureAsPdf } from '@mui/icons-material';
import { StripeInvoice } from '@/domain/auth/ISubscription';

export const useFacturaController = () => {
    const t = useTranslations();
    const classes = useStyles()
    const { currentEntity } = useEntity()
    const { showToast } = useToast()
    const [rowsPerPage, setRowsPerPage] = useState<number>(2); // Límite inicial
    const [params, setParams] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false)
    const [last, setLast] = useState<any>()
    const [pagination, setPagination] = useState(``);
    const [items, setItems] = useState<StripeInvoice[]>([]);
    const [itemsHistory, setItemsHistory] = useState<StripeInvoice[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [total, setTotal] = useState(0);


    const onSearch = (term: string): void => {
        setParams({ ...params, startAfter: null, filters: buildSearch(term) })
    }

    const onBack = (): void => {
        const backSize = items.length
        itemsHistory.splice(-backSize)
        setItemsHistory([...itemsHistory])
        setItems([...itemsHistory.slice(-rowsPerPage)])
        setAtEnd(false)
        setCurrentPage(currentPage - 1)
        setLast((itemsHistory[itemsHistory.length - 1] as any).last)
    }


    const onNext = async (): Promise<void> => {
        setLoading(true)
        setParams({ ...params, startAfter: last })
        setCurrentPage(currentPage + 1)
    }

    useEffect(() => {
        setAtStart(itemsHistory.length <= rowsPerPage)
    }, [itemsHistory.length, rowsPerPage])




    const columns: Column<StripeInvoice>[] = [
        {
            id: 'hosted_invoice_url', label: t("renew.text1"), minWidth: 170, format: (value, row) => <Box onClick={() => window.open(row.hosted_invoice_url as string, '_blank')} display="flex" alignItems="center">
                <Box sx={classes.fileThumbnail}>
                    <PictureAsPdf sx={{ fontSize: 100 }} />
                </Box>
            </Box>
        },
    ];

    const fetchingData = useCallback(() => {
        setLoading(true)
        fetchInvoicesByEntity(currentEntity?.entity.id as string, { ...params, limit: rowsPerPage }).then(async res => {
            if (res.length < rowsPerPage || res.length === 0)
                setAtEnd(true)
            else
                setAtEnd(false)

            if (res.length !== 0) {
                setItems(res)
                if (!params.startAfter)
                    setItemsHistory([...res])
                else
                    setItemsHistory(prev => [...prev, ...res])
                setLoading(false)
            }

            if (!params.startAfter && res.length === 0) {
                setItems([])
                setItemsHistory([])
            }

            setLast(res.length > 0 ? (res[0] as any).last : null)
            setPagination(`Total ${res.length > 0 ? (res[0] as any).totalItems : 0}`)
            setTotal(res.length > 0 ? (res[0] as any).totalItems : 0)

        }).catch(e => {
            showToast(e?.message, 'error')
        }).finally(() => {
            setLoading(false)
        })

    }, [currentEntity?.entity.id, params, rowsPerPage, showToast])

    useEffect(() => {
        if (params && currentEntity?.entity?.id)
            fetchingData()
    }, [params, currentEntity?.entity?.id, fetchingData])

    useEffect(() => {
        setCurrentPage(0)
        setParams({ limit: rowsPerPage })
        setAtStart(true)
    }, [rowsPerPage])






    return {
        items,
        atEnd,
        atStart,
        onSearch, onNext, onBack,
        pagination, currentPage,
        columns, total,
        loading, rowsPerPage, setRowsPerPage
    }
}

