import { SassButton } from "@/components/common/buttons/GenericButton"
import { Box, Typography, Paper, Alert, CircularProgress } from "@mui/material"
import { useTranslations } from "next-intl"
import SucursalFromItem from "./SucursalFromItem/SucursalFromItem"
import SearchFilter from "@/components/common/table/filters/SearchFilter"
import { SelectFilter } from "@/components/common/table/filters/SelectFilter"
import { ISucursal } from "@/domain/features/checkinbiz/ISucursal"
import ConfirmModal from "@/components/common/modals/ConfirmModal"
import { useCommonModal } from "@/hooks/useCommonModal"
import { CommonModalType } from "@/contexts/commonModalContext"
import BranchSelectorModal from "@/components/common/modals/BranchSelector"
import { EmployeeEntityResponsibility } from "@/domain/features/checkinbiz/IEmployee"
import { useEmployeeDetail } from "../detail.context"
import { Timestamp } from "firebase/firestore"

export const Branch = () => {
    const t = useTranslations()
    const { deleting, onDelete, onFilter, pending, entityResponsibilityList, jobList, onEnd, branchList, addEntityResponsibility, addResponsabiltyItem, responsabilityTotal, responsabilityFilter, responsabilityLimit, loadMore } = useEmployeeDetail()
    const { open } = useCommonModal()


    return <Paper elevation={0} sx={{ p: 3 }}>
        <Box gap={2} display={'flex'} flexDirection={'column'} mt={2}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'}>
                    <Typography variant="subtitle1" gutterBottom textTransform={'uppercase'}>
                        {t('core.label.sucursalAsigned')}
                    </Typography>
                    {pending && <CircularProgress size={20} color="inherit" />}
                </Box>

                <SassButton color="primary" variant="contained" onClick={addResponsabiltyItem} disabled={branchList.length == 0}>
                    {t('core.button.addBranch')}
                </SassButton>
            </Box>

            <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} gap={4}>
                <SearchFilter  
                    label={t('core.label.status')}
                    value={responsabilityFilter.find(e => e.field === 'active')?.value}
                    onChange={(value: any) => onFilter([...responsabilityFilter, { field: 'active', operator: '==', value }])}
                    options={[{ value: 1, label: t('core.label.active') }, { value: 0, label: t('core.label.inactive') }]}
                />

                {branchList.length > 0 && <SelectFilter width={200}
                    first firstText={t('core.label.all')}
                    label={t('core.label.subEntity')}
                    defaultValue={'none'}
                    value={responsabilityFilter.find((e: { field: string, operator: string, value: any }) => e.field === 'branchId')?.value ?? 'none'}
                    onChange={(value: any) => {
                        if (value) onFilter([...responsabilityFilter, { field: 'branchId', operator: '==', value }])
                        else onFilter([...responsabilityFilter.filter((e: { field: string, operator: string, value: any }) => e.field !== 'branchId')])

                    }}
                    items={branchList.map((e: ISucursal) => ({ value: e.id, label: e.name }))}
                />}
            </Box>
            <Box gap={1.5} display={'flex'} flexDirection={'column'}>
                {entityResponsibilityList.sort((a: EmployeeEntityResponsibility, b: EmployeeEntityResponsibility) => (b.assignedAt instanceof Timestamp?(b.assignedAt as Timestamp).toDate():b.assignedAt) -  (a.assignedAt instanceof Timestamp?(a.assignedAt as Timestamp).toDate():a.assignedAt)).sort((a: EmployeeEntityResponsibility, b: EmployeeEntityResponsibility) => a.active - b.active)?.map((e, i) => <SucursalFromItem key={e.id} item={e} jobList={jobList} onEnd={onEnd} />)}
                {entityResponsibilityList.length == 0 && <Box gap={1.5} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} p={5}>  <Alert severity="warning">{t('employee.advise')}</Alert></Box>}
                {branchList.length == 0 && <Box gap={1.5} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} p={5}>  <Alert severity="warning">{t('employee.noBranch')}</Alert></Box>}

            </Box>
            {responsabilityLimit <= responsabilityTotal && <SassButton variant='outlined' onClick={() => loadMore()} >{t('core.label.moreload')}</SassButton>}
        </Box>

        {open.type === CommonModalType.DELETE && open?.args?.responsability && <ConfirmModal
            isLoading={deleting}
            title={t('employee.deleteConfirmModalTitleResponsability')}
            description={t('employee.deleteConfirmModalTitle2Responsability')}
            onOKAction={(args: { id: string }) => onDelete(args.id)}
        />}

        {open.type === CommonModalType.BRANCH_SELECTED && <BranchSelectorModal type={'selector'}
            branchList={branchList?.map(e => ({ name: e.name, branchId: e.id as string }))}
            onOKAction={(branchId) => {
                addEntityResponsibility(branchId.branchId);
            }}
        />}
    </Paper>

}