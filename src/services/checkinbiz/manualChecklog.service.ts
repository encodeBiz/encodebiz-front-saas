import { HttpClient } from '@/lib/http/httpClientFetchNext';
import { mapperErrorFromBack } from '@/lib/common/String';

export interface IManualChecklogRequest {
  entityId: string;
  employeeId: string;
  branchId: string;
  date: string;
  reason: string;
  checkinAt?: string;
  checkoutAt?: string;
}

export interface IManualChecklogResponse {
  message: string;
  code: string;
  checkinId: string;
  checkoutId: string;
  autofilledFields: string[];
}

export async function requestManualChecklog(
  data: IManualChecklogRequest,
  token: string,
  locale: any = 'es'
): Promise<IManualChecklogResponse> {
  try {
    if (!token) throw new Error('Error to fetch user auth token');

    const client = new HttpClient({
      baseURL: '',
      headers: { authorization: `Bearer ${token}`, locale },
    });

    const response: any = await client.post(
      process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_REQUEST_MANUAL_CHECKLOG as string,
      data
    );

    if (response.errCode && response.errCode !== 200) {
      throw new Error(response.message);
    }

    return response as IManualChecklogResponse;
  } catch (error: any) {
    throw new Error(mapperErrorFromBack(error?.message as string, true) as string);
  }
}
