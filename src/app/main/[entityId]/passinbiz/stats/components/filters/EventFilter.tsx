import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { GroupBy } from "@/domain/features/passinbiz/IStats";
import { useEntity } from "@/hooks/useEntity";
import { search } from "@/services/passinbiz/event.service";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { forEach, groupBy } from "lodash";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const EventFilter = ({ value, onChange, onChangeData }: { value: Array<string>, onChangeData: (value: Array<{ id: string, name: string }>) => void, onChange: (value: Array<string>) => void }) => {
    const t = useTranslations()
    const [eventData, setEventData] = useState<Array<IEvent>>([])
    const { currentEntity } = useEntity()
    const inicializeEvent = async () => {
        const eventList = await search(currentEntity?.entity.id as string, { ...{} as any, limit: 100 })
        setEventData(eventList)
    }

    useEffect(() => {
        if (currentEntity?.entity.id) {
            inicializeEvent()
        }
    }, [currentEntity?.entity.id])

    return <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="gb-label">{t('stats.event')}</InputLabel>
        <Select
            multiple
            label="groupBy"
            value={value}
            renderValue={(selected) => (selected as string[]).map(id => eventData.find(o => o.id === id)?.name ?? id).join(', ')}
            onChange={(e) => {
                onChange(e.target.value as Array<string>)
                const data: Array<{ id: string, name: string }> = []
                if (Array.isArray(e.target.value))
                    e.target.value?.forEach(element => {
                        const item: IEvent = eventData.find(e => e.id === element) as IEvent
                        if (item) data.push({ id: item.id, name: item.name })
                    });
                onChangeData(data)
            }}>
            {eventData.map((o, i) => <MenuItem key={o.id} value={o.id}>
                <Checkbox checked={value.indexOf(o.id) > -1} />
                <ListItemText primary={o.name} />
            </MenuItem>)}
        </Select>
    </FormControl>
}