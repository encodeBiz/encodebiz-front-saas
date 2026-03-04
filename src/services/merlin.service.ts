import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { getRefByPathData } from "@/lib/firebase/firestore/readDocument";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { db } from "@/lib/firebase/initializeApp";

type MerlinRequest = {
  request: {
    branchIds: string[];
    lang: string;
    locale: string;
    entityId: string;
    target: "branch" | "entity" | "employee";
  };
};

type MerlinResponse =
  | { code: "ai/cache_hit"; cached: true; path: string; result: any }
  | { code: "ai/analysing"; cached: false; path: string }
  | { code: string; [k: string]: any };

const BASE_URL =
  process.env.NEXT_PUBLIC_MERLIN_API ??
  "http://localhost:8080/api/v1/gpt/interpret";

const TOKEN = process.env.NEXT_PUBLIC_MERLIN_TOKEN;

const getClient = (overrideToken?: string) =>
  new HttpClient({
    baseURL: "",
    headers: {
      ...(overrideToken ? { Authorization: `Bearer ${overrideToken}` } : TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      "Content-Type": "application/json",
    },
  });

export const merlinInterpret = async (payload: MerlinRequest, authToken?: string): Promise<MerlinResponse> => {
  const client = getClient(authToken);
  const url = `${BASE_URL}?mode=interpret`;
  return client.post(url, payload) as Promise<MerlinResponse>;
};

export const merlinSnapshot = async (path: string, _authToken?: string): Promise<MerlinResponse> => {
  // Snapshot se obtiene directamente de Firestore
  if (!path) throw new Error("path is required");
  const data = await getRefByPathData(path);
  if (data) {
    return { code: "ai/cache_hit", cached: true, path, result: data } as MerlinResponse;
  }
  return { code: "ai/analysing", cached: false, path } as MerlinResponse;
};

export const merlinSubscribe = (
  path: string,
  cb: (payload: MerlinResponse) => void
): (() => void) => {
  if (!path) throw new Error("path is required");
  const ref = doc(db, path);
  const unsubscribe = onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data: any = snap.data();
        if (data?.status === "completed") {
          const result = data?.result ?? data?.output ?? data;
          cb({ code: "ai/cache_hit", cached: true, path, result } as MerlinResponse);
        } else if (data?.status === "insufficient_data") {
          cb({ code: "analyze/insufficient_data", cached: true, path, result: data } as MerlinResponse);
        } else if (data?.status === "error") {
          cb({ code: "ai/error", cached: true, path, result: data } as MerlinResponse);
        } else {
          cb({ code: "ai/analysing", cached: false, path } as MerlinResponse);
        }
      } else {
        cb({ code: "ai/analysing", cached: false, path } as MerlinResponse);
      }
    },
    () => cb({ code: "ai/analysing", cached: false, path } as MerlinResponse)
  );
  return unsubscribe;
};
