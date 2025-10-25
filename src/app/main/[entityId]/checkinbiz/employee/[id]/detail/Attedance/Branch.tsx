import { SassButton } from "@/components/common/buttons/GenericButton"
import { Box, Typography, Paper } from "@mui/material"
import { useTranslations } from "next-intl"
import SucursalFromItem from "../SucursalFromItem/SucursalFromItem"
import SearchFilter from "@/components/common/table/filters/SearchFilter"
import { SelectFilter } from "@/components/common/table/filters/SelectFilter"
import useBranchDetailController from "./Branch.controller"
import { IEmployee } from "@/domain/features/checkinbiz/IEmployee"
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal"
import ConfirmModal from "@/components/common/modals/ConfirmModal"
import { useCommonModal } from "@/hooks/useCommonModal"
import { CommonModalType } from "@/contexts/commonModalContext"

export const Branch = ({ employee }: { employee: IEmployee }) => {
    const t = useTranslations()
    const { deleting, onDelete, entityResponsibilityList, jobList, branchList, addResponsabiltyItem, responsabilityTotal, responsabilityFilter, setResponsabilityFilter, responsabilityLimit, loadMore } = useBranchDetailController(employee)
    const {  open } = useCommonModal()


    return <Paper elevation={0} sx={{ p: 3 }}>
        <Box gap={2} display={'flex'} flexDirection={'column'} mt={2}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="subtitle1" gutterBottom>
                    {t('core.label.sucursalAsigned')}
                </Typography>

                <SassButton color="primary" variant="contained" onClick={addResponsabiltyItem}>
                    {t('core.button.addBranch')}
                </SassButton>
            </Box>

            <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} gap={4}>
                <SearchFilter
                    label={t('core.label.status')}
                    value={responsabilityFilter.find(e => e.field === 'active')?.value}
                    onChange={(value: any) => setResponsabilityFilter([...responsabilityFilter, { field: 'active', operator: '==', value }])}
                    options={[{ value: 1, label: t('core.label.active') }, { value: 0, label: t('core.label.inactive') }]}
                />

                {branchList.length > 0 && <SelectFilter
                    first
                    label={t('core.label.subEntity')}
                    defaultValue={'none'}
                    value={responsabilityFilter.find(e => e.field === 'active')?.value ?? 'none'}
                    onChange={(value: any) => {
                        if (value)
                            setResponsabilityFilter([...responsabilityFilter, { field: 'branchId', operator: '==', value }])
                        else
                            setResponsabilityFilter([...responsabilityFilter.filter(e => e.field !== 'branchId')])

                    }}
                    items={branchList.map((e: ISucursal) => ({ value: e.id, label: e.name }))}
                />}
            </Box>
            <Box gap={1.5} display={'flex'} flexDirection={'column'}>
                {entityResponsibilityList.sort((a, b) => a.active - b.active)?.map((e, i) => <SucursalFromItem key={i} item={e} jobList={jobList} />)}
            </Box>
            {responsabilityLimit <= responsabilityTotal && <SassButton variant='outlined' onClick={() => loadMore()} >{t('core.label.moreload')}</SassButton>}


        </Box>

        {open.type === CommonModalType.DELETE && open?.args?.responsability && <ConfirmModal
            isLoading={deleting}
            title={t('employee.deleteConfirmModalTitleResponsability')}
            description={t('employee.deleteConfirmModalTitle2Responsability')}
            onOKAction={(args: { id: string }) => onDelete(args.id)}
        />}
    </Paper>

}