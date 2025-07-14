import { useEffect, useState } from 'react';
import { fetchAllEntitiesPaginated } from '@/services/common/entity.service';
interface Column<T> {
    id: keyof T;
    label: string;
    minWidth?: number;
    align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
    format?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
}
export const useSuscriptionController = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Límite inicial

    const columns: Column<typeof data[0]>[] = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'lastname', label: 'Last Name', minWidth: 170 },
    ];

    const loadData = async () => {
        setLoading(true);
        const { items, lastVisible: newLastVisible } = await fetchAllEntitiesPaginated(rowsPerPage, page > 0 ? lastVisible : undefined);
        setData(items);
        setLastVisible(newLastVisible);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [page]);

    useEffect(() => {
        setPage(0);
    }, [rowsPerPage]);

    return { data, columns, loading, page, rowsPerPage, setPage, setRowsPerPage }
}