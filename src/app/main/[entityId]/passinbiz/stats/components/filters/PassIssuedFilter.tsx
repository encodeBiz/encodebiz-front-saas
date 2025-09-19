import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { Box } from "@mui/material"
import { DateRangePicker } from "./fields/DateRangeFilter"
import { EventFilter } from "./fields/EventFilter"
import { GroupByFilter } from "./fields/GroupByFilter"
import { TypeFilter } from "./fields/TypeFilter"
import { usePassinBizStats } from "../../context/passBizStatsContext"
import { useTranslations } from "next-intl"

export const PassIssuedFilter = () => {
  const { payloadPassIssued, setPayloadPassIssued } = usePassinBizStats()
  const t = useTranslations()
  return <BorderBox sx={{ width: "100%", p: 1, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
    <Box display={'flex'} justifyContent={'flex-end'} alignItems={'flex-end'} flexDirection={"row"}   >
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} gap={2} >

        <TypeFilter value={payloadPassIssued.type} onChange={(type) => {
          setPayloadPassIssued({ ...payloadPassIssued, type, events: type === 'credential' ? [] : payloadPassIssued.events })

        }} />
        <DateRangePicker value={payloadPassIssued.dateRange} onChange={(dateRange) => setPayloadPassIssued({ ...payloadPassIssued, dateRange })} />
        <GroupByFilter
          value={payloadPassIssued.groupBy}
          onChange={(groupBy) => {
            setPayloadPassIssued({ ...payloadPassIssued, groupBy })
          }} />
        {payloadPassIssued.type === 'event' && <EventFilter
          value={payloadPassIssued.events?.map(e => e.id) ?? []}
          onChangeData={(events) => {
            setPayloadPassIssued({ ...payloadPassIssued, events })
          }} />}
      </Box>
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} pb={1}  >
        <SassButton variant='contained' color='primary' size='small' onClick={() => { }}>{t('core.button.applyFilter')}</SassButton>
      </Box>
    </Box>

  </BorderBox>
}