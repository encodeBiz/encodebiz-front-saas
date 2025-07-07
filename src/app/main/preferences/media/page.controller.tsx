'use client'

import { useState, useEffect, useCallback } from 'react';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/useToast';
import { buildSearch, Column, IRowAction } from '@/components/common/table/GenericTable';
import { IUserMedia } from '@/domain/core/IUserMedia';
import { deleteMedia, search, uploadMedia } from '@/services/common/media.service';
import { useAuth } from '@/hooks/useAuth';




export const useMediaList = () => {
    const t = useTranslations();
    const { token, user } = useAuth()
    const { currentEntity } = useEntity()
    const { showToast } = useToast()
    const [rowsPerPage, setRowsPerPage] = useState<number>(2); // Límite inicial
    const [params, setParams] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false)
    const [last, setLast] = useState<any>()
    const [pagination, setPagination] = useState(``);
    const [items, setItems] = useState<IUserMedia[]>([]);
    const [itemsHistory, setItemsHistory] = useState<IUserMedia[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [total, setTotal] = useState(0);

    const rowAction: Array<IRowAction> = [
        { icon: "delete", label: 'Eliminar', onPress: (item: IUserMedia) => { } }
    ]

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


    const columns: Column<IUserMedia>[] = [
        { id: 'id', label: 'ID', minWidth: 170 },
        { id: 'filename', label: t("core.label.filename"), minWidth: 170 },
    ];

    const fetchingData = () => {
        setLoading(true)
        search(currentEntity?.entity.id as string, { ...params, limit: rowsPerPage }).then(async res => {
            if (res.length < rowsPerPage || res.length === 0)
                setAtEnd(true)
            else
                setAtEnd(false)

            if (res.length !== 0) {
                setItems(res)
                if (!params.startAfter)
                    setItemsHistory([...res])
                else
                    setItemsHistory([...itemsHistory, ...res])
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

    }

    useEffect(() => {
        if (params && currentEntity?.entity?.id)
            fetchingData()
    }, [params, currentEntity?.entity?.id])

    useEffect(() => {
        setCurrentPage(0)
        setParams({ limit: rowsPerPage })
        setAtStart(true)
    }, [rowsPerPage])

    const [deleting, setDeleting] = useState(false)
    const onDelete = async (item: any) => {
        try {
            setDeleting(true)
            const id = item[0]
            await deleteMedia({
                "mediaId": id,
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


    const [selectedType, setSelectedType] = useState<string>('')
    const [isUploading, setIsUploading] = useState(false);


    const handleFileChange = useCallback(async (event: any) => {
        try {
            const file = event.currentTarget.files[0];
            if (!file) return;
            setIsUploading(true);
            const form = new FormData();
            form.append('entityId', currentEntity?.entity.id as string);
            form.append('uid', user?.id as string);
            form.append('type', selectedType);
            form.append('file', file);
            (await uploadMedia(form, token) as { mediaId: string })?.mediaId
            setCurrentPage(0)
            setParams({ limit: rowsPerPage })
            setAtStart(true)
            setIsUploading(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setIsUploading(false);

        }
    }, [selectedType]);

    return {
        onDelete, selectedType, handleFileChange, isUploading, setSelectedType,
        items,
        atEnd,
        atStart,
        onSearch, onNext, onBack,
        pagination, currentPage,
        columns, deleting,
        loading, rowsPerPage, setRowsPerPage
    }
}

