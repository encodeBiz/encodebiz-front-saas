/* eslint-disable react-hooks/exhaustive-deps */
import { IEvent } from "@/domain/features/passinbiz/IEvent";
import { useEntity } from "@/hooks/useEntity";
import { search } from "@/services/passinbiz/event.service";
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const EventFilter = ({ value, onChangeData }: { value: Array<string>, onChangeData: (value: Array<{ id: string, name: string }>) => void }) => {
    const t = useTranslations()
    const [eventData, setEventData] = useState<Array<IEvent>>([])
    const { currentEntity } = useEntity()
    const inicializeEvent = async () => {
        const filters = [
            {
                field: 'status',
                operator: '==',
                value: 'published',
            },

            {
                field: 'date',
                operator: '<=',
                value: new Date(),
            }
        ]
        const eventList = await search(currentEntity?.entity.id as string, { ...{filters} as any, limit: 100 })
        setEventData(eventList)
    }

    useEffect(() => {
        if (currentEntity?.entity.id) {
            inicializeEvent()
        }
    }, [currentEntity?.entity.id])

    return <FormControl size="small" sx={{ minWidth: 140 ,mb:1}}>
        <InputLabel id="gb-label">{t('stats.event')}</InputLabel>
        <Select
            multiple
            label="groupBy"
            value={value}
            renderValue={(selected) => (selected as string[]).map(id => eventData.find(o => o.id === id)?.name ?? id).join(', ')}
            onChange={(e) => {

                const data: Array<{ id: string, name: string }> = []
                if (Array.isArray(e.target.value))
                    e.target.value?.forEach(element => {
                        const item: IEvent = eventData.find(e => e.id === element) as IEvent
                        if (item) data.push({ id: item.id, name: item.name })
                    });
                onChangeData(data)
            }}>
            {eventData.map((o, i) => <MenuItem key={i} value={o.id}>
                <Checkbox checked={value.indexOf(o.id) > -1} />
                <ListItemText primary={o.name} />
            </MenuItem>)}
        </Select>
    </FormControl>
}