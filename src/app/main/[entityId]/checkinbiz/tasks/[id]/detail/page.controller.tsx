/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { Task, TaskDetail, TaskStatus } from "@/domain/features/checkinbiz/ITask";
import { fetchEmployee } from "@/services/checkinbiz/employee.service";
import {
  addTaskNote,
  assignTaskWorkers,
  fetchTaskDetail,
  rateTaskWorker,
  rejectTask,
  updateTask,
  updateTaskStatus,
  uploadTaskResource,
  validateTask,
} from "@/services/checkinbiz/task.service";
import { useAppLocale } from "@/hooks/useAppLocale";
import { useAuth } from "@/hooks/useAuth";
import { useEntity } from "@/hooks/useEntity";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TaskActionType } from "./components/TaskActionDialog";

export default function useTaskDetailController() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { currentEntity, watchServiceAccess } = useEntity();
  const { currentLocale } = useAppLocale();
  const { navivateTo } = useLayout();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [action, setAction] = useState<TaskActionType | null>(null);

  const entityId = currentEntity?.entity.id as string;

  const loadDetail = async () => {
    if (!entityId || !id) return;
    setLoading(true);
    try {
      const data = await fetchTaskDetail(entityId, id);
      const assignments = await Promise.all(
        data.assignments.map(async (assignment) => {
          try {
            return { ...assignment, employee: await fetchEmployee(entityId, assignment.employeeId) };
          } catch {
            return assignment;
          }
        })
      );
      const resources = await Promise.all(
        data.resources.map(async (resource) => {
          try {
            return resource.employeeId ? { ...resource, employee: await fetchEmployee(entityId, resource.employeeId) } : resource;
          } catch {
            return resource;
          }
        })
      );
      const ratings = await Promise.all(
        data.ratings.map(async (rating) => {
          try {
            return { ...rating, employee: await fetchEmployee(entityId, rating.employeeId) };
          } catch {
            return rating;
          }
        })
      );
      setDetail({ ...data, assignments, resources, ratings });
    } catch (error: any) {
      showToast(error?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const runMutation = async (callback: () => Promise<any>) => {
    try {
      setSaving(true);
      await callback();
      setAction(null);
      setOpenForm(false);
      await loadDetail();
      showToast("Operación completada correctamente", "success");
    } catch (error: any) {
      showToast(error?.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const onUpdate = (data: Partial<Task>) =>
    runMutation(() =>
      updateTask(
        id,
        {
          ...data,
          entityId,
        },
        token,
        currentLocale
      )
    );

  const onStatus = (status: TaskStatus) => runMutation(() => updateTaskStatus(id, { entityId, status }, token, currentLocale));

  const onValidate = () => runMutation(() => validateTask(id, { entityId }, token, currentLocale));

  const onActionSubmit = (data: any) => {
    if (action === "assign") return runMutation(() => assignTaskWorkers(id, { entityId, employeeIds: data.employeeIds }, token, currentLocale));
    if (action === "note") return runMutation(() => addTaskNote(id, { entityId, content: data.content, type: data.type }, token, currentLocale));
    if (action === "reject") return runMutation(() => rejectTask(id, { entityId, reason: data.reason }, token, currentLocale));
    if (action === "cancel") return runMutation(() => updateTaskStatus(id, { entityId, status: "cancelled", cancellationReason: data.cancellationReason }, token, currentLocale));
    if (action === "rate") return runMutation(() => rateTaskWorker(id, { entityId, employeeId: data.employeeId, rating: data.rating, comment: data.comment }, token, currentLocale));
    if (action === "resource") {
      const formData = new FormData();
      formData.append("entityId", entityId);
      formData.append("branchId", detail?.task.branchId ?? "");
      formData.append("employeeId", data.employeeId ?? "");
      formData.append("type", data.type);
      formData.append("description", data.description ?? "");
      formData.append("file", data.file);
      return runMutation(() => uploadTaskResource(id, formData, token, currentLocale));
    }
  };

  const back = () => navivateTo(`/${CHECKINBIZ_MODULE_ROUTE}/tasks`);

  useEffect(() => {
    if (entityId) watchServiceAccess("checkinbiz");
  }, [entityId, watchServiceAccess]);

  useEffect(() => {
    loadDetail();
  }, [entityId, id]);

  return {
    detail,
    loading,
    saving,
    openForm,
    setOpenForm,
    action,
    setAction,
    back,
    onUpdate,
    onStatus,
    onValidate,
    onActionSubmit,
  };
}
