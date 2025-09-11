/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react';
import { useEntity } from '@/hooks/useEntity';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/useToast';
import { Column, IRowAction } from '@/components/common/table/GenericTable';
import { IUserMedia } from '@/domain/core/IUserMedia';
import { deleteMedia, search, uploadMedia } from '@/services/common/media.service';
import { useAuth } from '@/hooks/useAuth';
import { Box, Avatar, Typography, Chip, useTheme } from '@mui/material';
import { useStyles } from './page.styles';
import { getFileIcon, formatFileSize } from '@/lib/common/String';
import ImagePreview from '@/components/common/ImagePreview';
import { DeleteOutline } from '@mui/icons-material';
import { CommonModalType } from '@/contexts/commonModalContext';
import { useCommonModal } from '@/hooks/useCommonModal';
import { SassButton } from '@/components/common/buttons/GenericButton';


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
export const useMediaList = () => {
    const t = useTranslations();
    const theme = useTheme();
    const classes = useStyles(theme)
    const { token, user } = useAuth()
    const { currentEntity } = useEntity()
    const { showToast } = useToast()

    const { openModal, closeModal } = useCommonModal()

    /** Filter and PAgination Control */
    const [loading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<IUserMedia[]>([]);
    const [itemsHistory, setItemsHistory] = useState<IUserMedia[]>([]);
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



    const rowAction: Array<IRowAction> = []


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


    /** Limit Change */
    const onRowsPerPageChange = (limit: number) => {
        const filterParamsUpdated: IFilterParams = { ...filterParams, currentPage: 0, params: { ...filterParams.params, startAfter: null, limit } }
        setFilterParams(filterParamsUpdated)
        fetchingData(filterParamsUpdated)
    }




    const columns: Column<IUserMedia>[] = [
        {
            id: 'filename', label: t("core.label.filename"), minWidth: 170, format: (value, row) => <Box display="flex" flexDirection={'row'} alignItems="flex-start" justifyContent={'space-between'} width={'100%'}>

                <Box display="flex" alignItems="center">

                    <Box sx={classes.fileThumbnail}>
                        {row.url ? (
                            <ImagePreview
                                src={row.url}
                                alt=""
                                width={'80px'}
                                height={'80px'}
                                style={{ border: '1px solid #ddd' }}
                                zoomIconPosition="center"
                            />

                        ) : (
                            <Avatar variant="rounded" style={{ backgroundColor: 'transparent' }}>
                                {getFileIcon(row)}
                            </Avatar>
                        )}
                    </Box>

                    <Box sx={classes.fileInfo}>
                        <Typography
                            sx={{ overflow: 'hidden', width: '200px', whiteSpace: 'noWrap', textOverflow: 'ellipsis', }}
                            variant="body2" noWrap>
                            {row.filename}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {formatFileSize(row.sizeKB * 1024)}
                        </Typography>
                        <Box mt={0.5}>
                            <Chip
                                size="small"
                                label={row.type}
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                </Box>
                <SassButton color='error' variant='outlined' startIcon={<DeleteOutline />} onClick={() => openModal(CommonModalType.DELETE, { data: row })} >{t('core.button.delete')}</SassButton>

            </Box>
        },
    ];

    const fetchingData = (filterParams: IFilterParams) => {
        setLoading(true)
        search(currentEntity?.entity.id as string, { ...(filterParams.params as any) }).then(async res => {
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

    const [deleting, setDeleting] = useState(false)
    const onDelete = async (item: any) => {
 
        try {
            setDeleting(true)
            const id = item?.id
            await deleteMedia({
                "mediaId": id,
                "entityId": currentEntity?.entity.id
            }, token)
            setItemsHistory(itemsHistory.filter(e => e.id !== id))
            setItems(itemsHistory.filter(e => e.id !== id))
            setDeleting(false)
            closeModal(CommonModalType.DELETE)
        } catch (e: any) {
            showToast(e?.message, 'error')
            setDeleting(false)
        }
    }


    const [selectedType, setSelectedType] = useState<string>('')
    const [isUploading, setIsUploading] = useState(false);
    const renameFile = async (originalFile: File, newName: string) => {
        // Get the file data
        const buffer = await originalFile.arrayBuffer();

        // Create new file with same data but new name
        return new File([buffer], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified
        });
    }


    const handleFileChange = async (file: File) => {
        try {
            if (!file) return;
            setIsUploading(true);
            const renameF = await renameFile(file, file.name)
            const form = new FormData();
            form.append('entityId', currentEntity?.entity.id as string);
            form.append('uid', user?.id as string);
            form.append('type', selectedType);
            form.append('file', renameF);
            await uploadMedia(form, token)
            fetchingData(filterParams)
            setIsUploading(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(String(error), 'error');
            }
            setIsUploading(false);

        }
    }


    useEffect(() => {
        if (currentEntity?.entity?.id) {
            fetchingData(filterParams)
        }
    }, [currentEntity?.entity?.id])

    return {
        onDelete, selectedType, handleFileChange, isUploading, setSelectedType,
        items,
        rowAction,
        onNext, onBack,
        columns, deleting,
        loading, filterParams, onRowsPerPageChange
    }
}

