import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { Alert, Box } from "@mui/material"
import { DateRangePicker } from "./fields/DateRangeFilter"
import { EventFilter } from "./fields/EventFilter"
import { GroupByFilter } from "./fields/GroupByFilter"
import { TypeFilter } from "./fields/TypeFilter"
import { usePassinBizStats } from "../../context/passBizStatsContext"
import { useTranslations } from "next-intl"
import { IPassValidatorStatsRequest } from "../../model/PassValidator"

export const PassValidatorFilter = () => {
  const { payloadPassValidator, setPayloadPassValidator, applyFilter, error } = usePassinBizStats()
  const t = useTranslations()
  return <BorderBox sx={{ width: "100%", p: 3, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
    {error['validator'] && <Alert sx={{ mb: 3 }} variant="outlined"
      severity="warning"
    >{error['validator']}</Alert>}
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexDirection={"row"}   >
      <Box display={'flex'} flexWrap={'wrap'} justifyContent={'flex-start'} flexDirection={'column'} gap={2} >
        <Box display={'flex'} flexWrap={'wrap'} justifyContent={'flex-start'} alignItems={'center'} flexDirection={{ xs: "column", md: "row" }} gap={2} >
          <TypeFilter value={payloadPassValidator?.type as "event" | "credential"} onChange={(type: "event" | "credential") => {
            setPayloadPassValidator({ ...payloadPassValidator as IPassValidatorStatsRequest, type, events: type === 'credential' ? [] : payloadPassValidator?.events })

          }} />

          {payloadPassValidator?.type === 'event' && <EventFilter
            value={payloadPassValidator?.events?.map(e => e.id) ?? []}
            onChangeData={(events) => {
              setPayloadPassValidator({ ...payloadPassValidator, events })
            }} />
          }
          <GroupByFilter
            value={payloadPassValidator?.groupBy as any}
            onChange={(groupBy) => {
              setPayloadPassValidator({ ...payloadPassValidator as IPassValidatorStatsRequest, groupBy })
            }} />
          <DateRangePicker value={payloadPassValidator?.dateRange as any} onChange={(dateRange) => setPayloadPassValidator({ ...payloadPassValidator as IPassValidatorStatsRequest, dateRange })} />

        </Box>




      </Box>
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} pb={1} pl={2} >
        <SassButton disabled={!payloadPassValidator?.type || (payloadPassValidator?.type === 'event' && !Array.isArray(payloadPassValidator?.events)) || (payloadPassValidator?.type === 'event' && payloadPassValidator?.events?.length === 0)} variant='contained' color='primary' size='small' onClick={() => applyFilter('validator')}>{t('core.button.applyFilter')}</SassButton>
      </Box>
    </Box>

  </BorderBox>
}