import { SassButton } from "@/components/common/buttons/GenericButton"
import { BorderBox } from "@/components/common/tabs/BorderBox"
import { Box } from "@mui/material"
import { DateRangePicker } from "./fields/DateRangeFilter"
import { EventFilter } from "./fields/EventFilter"
import { GroupByFilter } from "./fields/GroupByFilter"
import { TypeFilter } from "./fields/TypeFilter"
import { usePassinBizStats } from "../../context/passBizStatsContext"
import { useTranslations } from "next-intl"
import { IPassIssuedStatsRequest } from "../../model/PassIssued"

export const PassIssuedFilter = () => {
  const { payloadPassIssued, setPayloadPassIssued, applyFilter } = usePassinBizStats()
  const t = useTranslations()
  return <BorderBox sx={{ width: "100%", p: 1, boxShadow: '0px 1px 4px 0.5px rgba(219, 217, 222, 0.85)', }}>
    <Box display={'flex'} justifyContent={'flex-end'} alignItems={'flex-end'} flexDirection={"row"}   >
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={'column'} gap={2} >
        <Box display={'flex'} flexWrap={'wrap'} justifyContent={'flex-end'} alignItems={'center'} flexDirection={{ xs: "column", md: "row" }} gap={2} >
          <TypeFilter value={payloadPassIssued?.type as "event" | "credential"} onChange={(type: "event" | "credential") => {
            setPayloadPassIssued({ ...payloadPassIssued as IPassIssuedStatsRequest, type, events: type === 'credential' ? [] : payloadPassIssued?.events })

          }} />

          {payloadPassIssued?.type === 'event' && <EventFilter
            value={payloadPassIssued?.events?.map(e => e.id) ?? []}
            onChangeData={(events) => {
              setPayloadPassIssued({ ...payloadPassIssued, events })
            }} />
          }


          <GroupByFilter
            value={payloadPassIssued?.groupBy as any}
            onChange={(groupBy) => {
              setPayloadPassIssued({ ...payloadPassIssued as IPassIssuedStatsRequest, groupBy })
            }} />
          <DateRangePicker value={payloadPassIssued?.dateRange as any} onChange={(dateRange) => setPayloadPassIssued({ ...payloadPassIssued as IPassIssuedStatsRequest, dateRange })} />

        </Box>



      </Box>
      <Box display={'flex'} flexWrap={'wrap'} flexDirection={{ xs: "column", md: "row" }} pb={1} pl={2} >
        <SassButton disabled={!payloadPassIssued?.type || (payloadPassIssued?.type === 'event' && payloadPassIssued?.events?.length === 0)} variant='contained' color='primary' size='small' onClick={() => applyFilter("issued")}>{t('core.button.applyFilter')}</SassButton>
      </Box>
    </Box>

  </BorderBox>
}