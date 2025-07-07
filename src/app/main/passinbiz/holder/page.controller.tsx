import { Column } from "@/components/common/table/GenericTable";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";




export default function useHolderListController() {
  const t = useTranslations();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5); // Límite inicial

  const columns: Column<typeof data[0]>[] = [
    { id: 'id', label: 'ID', minWidth: 170 },
    { id: 'name', label: t("core.label.fullName"), minWidth: 170 },
  ];

  const loadData = async () => {
    setLoading(true);
    const items = [
      { id: "001", name: "Jose Maceo", total: "3" },
      { id: "002", name: "Yassiel Grajales", total: "3" },
      { id: "003", name: "Roider Perez", total: "3" },
    ];
    setTimeout(() => {
      setData(items);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    loadData();
  }, [page]);

  useEffect(() => {
    setPage(0);
  }, [rowsPerPage]);

  return { data, columns, loading, page, rowsPerPage, setPage, setRowsPerPage }

}