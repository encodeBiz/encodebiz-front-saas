import { CalendarDeletePayload, CalendarUpsertPayload } from "@/domain/features/checkinbiz/ICalendar";
import { mapperErrorFromBack } from "@/lib/common/String";
import { HttpClient } from "@/lib/http/httpClientFetchNext";

const CALENDAR_HANDLER_URL = process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_CALENDAR_HANDLER as string;
const CALENDAR_PRESET_URL = `${CALENDAR_HANDLER_URL}?action=savePreset`;

const getClient = (token: string, locale: any) => new HttpClient({
    baseURL: "",
    headers: {
        authorization: `Bearer ${token}`,
        locale
    },
});

export type CalendarPresetScope = "entity" | "branch" | "employee";

export async function upsertCalendar(payload: CalendarUpsertPayload, token: string, locale: any = 'es') {
    try {
        if (!token) {
            throw new Error("Error to fetch user auth token");
        }
        const client = getClient(token, locale);
        const response: any = await client.patch(CALENDAR_HANDLER_URL, payload);

        if (response?.errCode && response.errCode !== 200) {
            throw new Error(response.message);
        }
        return response;
    } catch (error: any) {
        throw new Error(mapperErrorFromBack(error?.message as string, true) as string);
    }
}

export async function saveCalendarPreset(
    payload: { scope: CalendarPresetScope; entityId: string; branchId?: string; employeeId?: string; name: string },
    token: string,
    locale: any = 'es'
) {
    if (!token) throw new Error("Error to fetch user auth token");
    const client = getClient(token, locale);
    const response: any = await client.post(CALENDAR_PRESET_URL, payload);
    if (response?.errCode && response.errCode !== 200) throw new Error(response.message);
    return response?.data ?? response;
}

export async function listCalendarPresets(
    params: { scope?: CalendarPresetScope; entityId?: string; branchId?: string; employeeId?: string; search?: string },
    token: string,
    locale: any = 'es'
) {
    if (!token) throw new Error("Error to fetch user auth token");
    const client = getClient(token, locale);
    const searchParams = new URLSearchParams({ ...params, type: 'preset' } as any).toString();
    const url = `${CALENDAR_HANDLER_URL}?${searchParams}`;
    const response: any = await client.get(url, {});
    if (response?.errCode && response.errCode !== 200) throw new Error(response.message);
    return response?.data ?? response ?? [];
}

export async function fetchCalendarPreset(id: string, token: string, locale: any = 'es') {
    if (!token) throw new Error("Error to fetch user auth token");
    const client = getClient(token, locale);
    const url = `${CALENDAR_HANDLER_URL}?id=${id}`;
    const response: any = await client.get(url, {});
    if (response?.errCode && response.errCode !== 200) throw new Error(response.message);
    return response?.data ?? response;
}

export async function deleteCalendarItem(payload: CalendarDeletePayload, token: string, locale: any = 'es') {
    try {
        if (!token) {
            throw new Error("Error to fetch user auth token");
        }
        const client = getClient(token, locale);
        const response: any = await client.delete(CALENDAR_HANDLER_URL, payload);
        if (response?.errCode && response.errCode !== 200) {
            throw new Error(response.message);
        }
        return response;
    } catch (error: any) {
        throw new Error(mapperErrorFromBack(error?.message as string, true) as string);
    }
}

type FetchEffectiveCalendarParams = {
    scope: 'entity' | 'branch' | 'employee';
    entityId: string;
    branchId?: string;
    employeeId?: string;
    token: string;
    locale?: any;
};

export async function fetchEffectiveCalendar(params: FetchEffectiveCalendarParams) {
    const { token, locale = 'es', ...query } = params;
    if (!token) throw new Error("Error to fetch user auth token");
    const client = getClient(token, locale);
    const searchParams = new URLSearchParams(query as any).toString();
    const url = `${CALENDAR_HANDLER_URL}?${searchParams}`;
    const response: any = await client.get(url, {});
    if (response?.errCode && response.errCode !== 200) {
        throw new Error(response.message);
    }
    return response?.data ?? response;
}
