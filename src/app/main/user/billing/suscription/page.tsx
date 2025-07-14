"use client"
import { GenericTable } from "@/components/common/table/GenericTable";
import { Container } from "@mui/material";
import { useSuscriptionController } from "./page.controller";
import { useTranslations } from "next-intl";
export default function SuscriptionPage() {

    const { data, columns, loading, page, rowsPerPage, setPage, setRowsPerPage } = useSuscriptionController();
    const t = useTranslations();
    return (
        <Container maxWidth="xl">
            <GenericTable
                data={data}
                columns={columns}
                title={t("layout.side.menu.Subscription")}
                keyField="id"
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
            />

        </Container>
    );
}