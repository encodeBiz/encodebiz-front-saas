import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { Box } from "@mui/material"
import { DateRangePicker } from "./fields/DateRangeFilter"
import { EventFilter } from "./fields/EventFilter"
import { GroupByFilter } from "./fields/GroupByFilter"
import { TypeFilter } from "./fields/TypeFilter"
import { usePassinBizStats } from "../../context/passBizStatsContext"
import { useTranslations } from "next-intl"
import { Chart2SeriesFilter } from "./fields/Chart2SeriesFilter"
import { IPassValidatorStatsRequest } from "../../model/PassValidator"

export const PassValidatorFilter = () => {
  const { payloadPassValidator, setPayloadPassValidator, seriesChart2, applyFilter } = usePassinBizStats()
  const t = useTranslations()
  return <BorderBox sx={{ width: "100%", p: 1, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
    <Box display={'flex'} justifyContent={'flex-end'} alignItems={'flex-end'} flexDirection={"row"}   >
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} gap={2} >
        <TypeFilter value={payloadPassValidator?.type as any} onChange={(type) => {
          setPayloadPassValidator({ ...payloadPassValidator as IPassValidatorStatsRequest, type, events: type === 'credential' ? [] : payloadPassValidator?.events })
        }} />
        <DateRangePicker value={payloadPassValidator?.dateRange as any} onChange={(dateRange) => setPayloadPassValidator({ ...payloadPassValidator as IPassValidatorStatsRequest, dateRange })} />
        <GroupByFilter
          value={payloadPassValidator?.groupBy as any}
          onChange={(groupBy) => {
            setPayloadPassValidator({ ...payloadPassValidator as IPassValidatorStatsRequest, groupBy })
          }} />
        {payloadPassValidator?.type === 'event' && <EventFilter
          value={payloadPassValidator?.events?.map(e => e.id) ?? []}
          onChangeData={(events) => {
            setPayloadPassValidator({ ...payloadPassValidator, events })
          }} />}
      </Box>
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} pb={1}  >
        <SassButton variant='contained' color='primary' size='small' onClick={() => applyFilter('validator')}>{t('core.button.applyFilter')}</SassButton>
      </Box>
    </Box>

  </BorderBox>
}