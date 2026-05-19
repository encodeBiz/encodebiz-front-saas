import { collection } from "@/config/collection";
import { SearchParams } from "@/domain/core/firebase/firestore";
import {
  Task,
  TaskActivity,
  TaskAssignment,
  TaskDetail,
  TaskNote,
  TaskRating,
  TaskResource,
  TaskStatus,
  TaskValidation,
} from "@/domain/features/checkinbiz/ITask";
import { mapperErrorFromBack } from "@/lib/common/String";
import { searchFirestore } from "@/lib/firebase/firestore/searchFirestore";
import { getOne } from "@/lib/firebase/firestore/readDocument";
import { HttpClient } from "@/lib/http/httpClientFetchNext";
import { codeError } from "@/config/errorLocales";

const TASKS_HANDLER_URL = process.env.NEXT_PUBLIC_BACKEND_URI_CHECKINBIZ_TASKS_HANDLER as string;

const getTasksUrl = () => TASKS_HANDLER_URL;

const getClient = (token: string, locale: any) =>
  new HttpClient({
    baseURL: "",
    headers: {
      authorization: `Bearer ${token}`,
      locale,
    },
  });

const taskCollection = (entityId: string) => `${collection.ENTITIES}/${entityId}/tasks`;
const taskSubCollection = (entityId: string, taskId: string, subCollection: string) =>
  `${taskCollection(entityId)}/${taskId}/${subCollection}`;

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

export async function searchTasks(entityId: string, params: Partial<SearchParams> = {}): Promise<Task[]> {
  const filters = [...(params.filters ?? [])];
  return searchFirestore<Task>({
    collection: taskCollection(entityId),
    limit: 10,
    orderBy: "createdAt",
    orderDirection: "desc",
    includeCount: true,
    ...params,
    filters,
  } as SearchParams);
}

export async function fetchTask(entityId: string, taskId: string): Promise<Task> {
  return getOne<Task>(taskCollection(entityId), taskId);
}

export async function fetchTaskAssignments(entityId: string, taskId: string): Promise<TaskAssignment[]> {
  const assignments = await searchFirestore<TaskAssignment>({
    collection: taskSubCollection(entityId, taskId, "assignments"),
    orderBy: "assignedAt",
    orderDirection: "asc",
    limit: 100,
    includeCount: false,
  } as SearchParams);

  return assignments.filter((assignment) => assignment.status !== "removed");
}

export async function fetchTaskNotes(entityId: string, taskId: string): Promise<TaskNote[]> {
  return searchFirestore<TaskNote>({
    collection: taskSubCollection(entityId, taskId, "notes"),
    orderBy: "createdAt",
    orderDirection: "desc",
    limit: 100,
    includeCount: false,
  } as SearchParams);
}

export async function fetchTaskResources(entityId: string, taskId: string): Promise<TaskResource[]> {
  return searchFirestore<TaskResource>({
    collection: taskSubCollection(entityId, taskId, "resources"),
    orderBy: "createdAt",
    orderDirection: "desc",
    limit: 100,
    includeCount: false,
  } as SearchParams);
}

export async function fetchTaskRatings(entityId: string, taskId: string): Promise<TaskRating[]> {
  return searchFirestore<TaskRating>({
    collection: taskSubCollection(entityId, taskId, "ratings"),
    orderBy: "ratedAt",
    orderDirection: "desc",
    limit: 100,
    includeCount: false,
  } as SearchParams);
}

export async function fetchTaskValidations(entityId: string, taskId: string): Promise<TaskValidation[]> {
  return searchFirestore<TaskValidation>({
    collection: taskSubCollection(entityId, taskId, "validations"),
    orderBy: "validatedAt",
    orderDirection: "desc",
    limit: 100,
    includeCount: false,
  } as SearchParams);
}

export async function fetchTaskActivity(entityId: string, taskId: string): Promise<TaskActivity[]> {
  return searchFirestore<TaskActivity>({
    collection: taskSubCollection(entityId, taskId, "activity"),
    orderBy: "createdAt",
    orderDirection: "desc",
    limit: 100,
    includeCount: false,
  } as SearchParams);
}

export async function fetchTaskDetail(entityId: string, taskId: string): Promise<TaskDetail> {
  const [task, assignments, notes, resources, ratings, activity, validations] = await Promise.all([
    fetchTask(entityId, taskId),
    fetchTaskAssignments(entityId, taskId),
    fetchTaskNotes(entityId, taskId),
    fetchTaskResources(entityId, taskId),
    fetchTaskRatings(entityId, taskId),
    fetchTaskActivity(entityId, taskId),
    fetchTaskValidations(entityId, taskId),
  ]);

  return { task, assignments, notes, resources, ratings, activity, validations };
}

export async function createTask(data: Partial<Task>, token: string, locale: any = "es") {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).post(getTasksUrl(), data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function updateTask(taskId: string, data: Partial<Task>, token: string, locale: any = "es") {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).patch(`${getTasksUrl()}/${taskId}`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function assignTaskWorkers(
  taskId: string,
  data: { entityId: string; employeeIds: string[] },
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).post(`${getTasksUrl()}/${taskId}/assignments`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function deleteTaskAssignment(
  taskId: string,
  employeeId: string,
  entityId: string,
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const query = new URLSearchParams({ entityId }).toString();
    const response = await getClient(token, locale).delete(`${getTasksUrl()}/${taskId}/assignments/${employeeId}?${query}`);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function updateTaskStatus(
  taskId: string,
  data: { entityId: string; status: TaskStatus; cancellationReason?: string },
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).patch(`${getTasksUrl()}/${taskId}/status`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function addTaskNote(
  taskId: string,
  data: { entityId: string; content: string; type: string },
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).post(`${getTasksUrl()}/${taskId}/notes`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function updateTaskNote(
  taskId: string,
  noteId: string,
  data: { entityId: string; content: string },
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).patch(`${getTasksUrl()}/${taskId}/notes/${noteId}`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function validateTask(
  taskId: string,
  data: { entityId: string; comment?: string },
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).post(`${getTasksUrl()}/${taskId}/validation`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function rejectTask(
  taskId: string,
  data: { entityId: string; reason: string },
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await getClient(token, locale).post(`${getTasksUrl()}/${taskId}/rejection`, data);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function rateTaskWorker(
  taskId: string,
  data: { entityId: string; employeeId: string; rating: number; comment?: string; image?: File | null },
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    if (data.image) {
      const formData = new FormData();
      formData.append("entityId", data.entityId);
      formData.append("employeeId", data.employeeId);
      formData.append("rating", `${data.rating}`);
      if (data.comment?.trim()) formData.append("comment", data.comment.trim());
      formData.append("image", data.image);

      const response = await fetch(`${getTasksUrl()}/${taskId}/ratings`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          locale,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error ? JSON.stringify(error) : `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) return unwrapResponse(await response.json());
      return {};
    }

    const jsonPayload = {
      entityId: data.entityId,
      employeeId: data.employeeId,
      rating: data.rating,
      ...(data.comment?.trim() ? { comment: data.comment.trim() } : {}),
    };
    const response = await getClient(token, locale).post(`${getTasksUrl()}/${taskId}/ratings`, jsonPayload);
    return unwrapResponse(response);
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}

export async function uploadTaskResource(
  taskId: string,
  data: FormData,
  token: string,
  locale: any = "es"
) {
  try {
    if (!token) throw new Error("Error to fetch user auth token");
    const response = await fetch(`${getTasksUrl()}/${taskId}/resources`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        locale,
      },
      body: data,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? error?.error ?? `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) return unwrapResponse(await response.json());
    return {};
  } catch (error: any) {
    handleServiceError(error, locale);
  }
}
