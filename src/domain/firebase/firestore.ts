import firebase from "firebase/compat/app";
import { DocumentData, PartialWithFieldValue, WithFieldValue } from "firebase/firestore";

export interface SearchParams {
    collection: string;
    filters?: Array<{
      field: string;
      operator: firebase.firestore.WhereFilterOp;
      value: any;
    }>;
    orderBy?: string;
    orderDirection?: "asc" | "desc";
    limit?: number;
    startAt?: any;
    startAfter?: any;
    uid? : string;
    endRef?: string;
    startRef?: string;
    includeCount?:boolean
  }

  export interface AddDocumentParams {
    id?:string,
    collection: string;
    data: WithFieldValue<DocumentData>;
  }

  export interface SetDocumentParams {
    collection: string;
    id: string;
    data: PartialWithFieldValue<DocumentData>;
    merge?: boolean;
  }
  
  export interface UpdateDocumentParams<T> {
    collection: string;
    id: string;
    data: Partial<T>;
  }

  export interface DeleteDocumentParams {
    collection: string;
    id: string;
  }