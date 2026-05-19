import {
  DocumentListParams,
  DocumentListResponse,
  DocumentDetailResponse,
  DocumentDownloadResponse,
  DocumentUpdatePayload,
  ManagedDocument,
} from "@/domain/features/checkinbiz/IDocument";
import { mapperErrorFromBack } from "@/lib/common/String";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { codeError } from "@/config/errorLocales";

const DOCUMENTS_HANDLER_URL = process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_DOCUMENTS_HANDLER as string;

const getBaseUrl = () => DOCUMENTS_HANDLER_URL;

const getClient = (token: string, locale: any) =>
  new HttpClient({
    baseURL: "",
    headers: {
      authorization: `Bearer ${token}`,
      locale,
    },
  });

const unwrapResponse = (response: any) => {
  if (response?.errCode && response.errCode !== 200) throw new Error(response.message);
  return response?.data ?? response;
};

const handleServiceError = (error: any, locale: any = "es") => {
  const rawMessage = error?.message;
  let parsed: any = null;
  try {
    parsed = typeof rawMessage === "string" ? JSON.parse(rawMessage) : rawMessage;
  } catch {
    parsed = null;
  }
  const code = parsed?.code;
  const mapped = code ? codeError?.[locale]?.[code] ?? codeError?.es?.[code] : null;
  if (mapped) throw new Error(mapped);
  if (typeof parsed?.message === "string") throw new Error(parsed.message);
  if (typeof parsed?.error === "string") throw new Error(parsed.error);
  throw new Error(mapperErrorFromBack(rawMessage as string, false) as string);
};

export async function fetchDocuments(
  params: DocumentListParams,
  token: string,
  locale: any = "es"
): Promise<DocumentListResponse> {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, String(value));
      }
    });
    const response = await getClient(token, locale).get(`${getBaseUrl()}?${query.toString()}`);
    return unwrapResponse(response) as DocumentListResponse;
  } catch (error: any) {
    handleServiceError(error, locale);
    throw error;
  }
}

export async function fetchDocumentById(
  documentId: string,
  entityId: string,
  token: string,
  locale: any = "es"
): Promise<DocumentDetailResponse> {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const query = new URLSearchParams({ entityId });
    const response = await getClient(token, locale).get(`${getBaseUrl()}/${documentId}?${query.toString()}`);
    return unwrapResponse(response) as DocumentDetailResponse;
  } catch (error: any) {
    handleServiceError(error, locale);
    throw error;
  }
}

export async function uploadDocument(
  data: FormData,
  token: string,
  locale: any = "es"
): Promise<{ ok: boolean; document: ManagedDocument }> {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await fetch(getBaseUrl(), {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        locale,
      },
      body: data,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error ? JSON.stringify(error) : `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) return unwrapResponse(await response.json());
    return { ok: true, document: {} as ManagedDocument };
  } catch (error: any) {
    handleServiceError(error, locale);
    throw error;
  }
}

export async function updateDocument(
  documentId: string,
  data: DocumentUpdatePayload,
  token: string,
  locale: any = "es"
): Promise<{ ok: boolean; document: ManagedDocument }> {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).patch(`${getBaseUrl()}/${documentId}`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
    throw error;
  }
}

export async function downloadDocument(
  documentId: string,
  entityId: string,
  token: string,
  locale: any = "es"
): Promise<DocumentDownloadResponse> {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const query = new URLSearchParams({ entityId });
    const response = await getClient(token, locale).get(
      `${getBaseUrl()}/${documentId}/download?${query.toString()}`
    );
    return unwrapResponse(response) as DocumentDownloadResponse;
  } catch (error: any) {
    handleServiceError(error, locale);
    throw error;
  }
}

export async function acknowledgeDocument(
  documentId: string,
  entityId: string,
  token: string,
  locale: any = "es"
): Promise<{ ok: boolean }> {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).post(`${getBaseUrl()}/${documentId}/ack`, { entityId });
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
    throw error;
  }
}

export async function archiveDocument(
  documentId: string,
  entityId: string,
  archiveReason: string | undefined,
  token: string,
  locale: any = "es"
): Promise<{ ok: boolean }> {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const query = new URLSearchParams({ entityId });
    if (archiveReason?.trim()) query.set("archiveReason", archiveReason.trim());
    const response = await getClient(token, locale).delete(`${getBaseUrl()}/${documentId}?${query.toString()}`);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
    throw error;
  }
}
