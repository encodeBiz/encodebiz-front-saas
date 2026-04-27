/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CHECKINBIZ_MODULE_ROUTE } from "@/config/routes";
import { EmployeeEntityResponsibility } from "@/domain/features/checkinbiz/IEmployee";
import { Task, TaskDetail, TaskStatus } from "@/domain/features/checkinbiz/ITask";
import { fetchEmployee, search as searchEmployee, searchResponsability } from "@/services/checkinbiz/employee.service";
import { fetchUser } from "@/services/core/users.service";
import { fetchSucursal } from "@/services/checkinbiz/sucursal.service";
import {
  addTaskNote,
  assignTaskWorkers,
  deleteTaskAssignment,
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
  const { token, user } = useAuth();
  const { currentEntity, watchServiceAccess } = useEntity();
  const { currentLocale } = useAppLocale();
  const { navivateTo } = useLayout();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [action, setAction] = useState<TaskActionType | null>(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<string | null>(null);
  const [canManageAssignments, setCanManageAssignments] = useState(false);

  const entityId = currentEntity?.entity.id as string;

  const loadDetail = async () => {
    if (!entityId || !id) return;
    setLoading(true);
    try {
      const data = await fetchTaskDetail(entityId, id);
      let branch = data.task.branch;
      try {
        branch = await fetchSucursal(entityId, data.task.branchId);
      } catch {
        branch = data.task.branch;
      }
      const assignments = await Promise.all(
        data.assignments.map(async (assignment) => {
          try {
            return { ...assignment, employee: await fetchEmployee(entityId, assignment.employeeId) };
          } catch {
            return assignment;
          }
        })
      );
      const notes = await Promise.all(
        data.notes.map(async (note) => {
          try {
            const createdByEmployee = await fetchEmployee(entityId, note.createdBy).catch(() => undefined);
            const createdByUser = createdByEmployee ? undefined : await fetchUser(note.createdBy).catch(() => undefined);
            return {
              ...note,
              createdByName: createdByEmployee?.fullName ?? createdByUser?.fullName ?? note.createdBy,
            };
          } catch {
            return note;
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
            const employee = await fetchEmployee(entityId, rating.employeeId).catch(() => undefined);
            const ratedByEmployee = await fetchEmployee(entityId, rating.ratedBy).catch(() => undefined);
            const ratedByUser = ratedByEmployee ? undefined : await fetchUser(rating.ratedBy).catch(() => undefined);
            return {
              ...rating,
              employee,
              ratedByUser,
              ratedByName: ratedByEmployee?.fullName ?? ratedByUser?.fullName ?? rating.ratedBy,
            };
          } catch {
            return rating;
          }
        })
      );
      setDetail({ ...data, task: { ...data.task, branch }, assignments, notes, resources, ratings });
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

  const onRemoveAssignment = (employeeId: string) => {
    return runMutation(() => deleteTaskAssignment(id, employeeId, entityId, token, currentLocale));
  };

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

  const resolveCurrentEmployee = async () => {
    if (!entityId || !user?.id) return;
    try {
      const employees = await searchEmployee(entityId, {
        filters: [{ field: "uid", operator: "==", value: user.id }],
        limit: 1,
        includeCount: false,
      } as any);
      setCurrentEmployeeId(employees?.[0]?.id ?? null);
    } catch {
      setCurrentEmployeeId(null);
    }
  };

  const resolveAdministrativePermissions = async () => {
    if (!entityId || !currentEmployeeId || !detail?.task.branchId) return;
    try {
      if (currentEntity?.role === "owner" || currentEntity?.role === "admin") {
        setCanManageAssignments(true);
        return;
      }

      const responsibilities: Array<EmployeeEntityResponsibility> = await searchResponsability(
        entityId,
        currentEmployeeId,
        100,
        [{ field: "active", operator: "==", value: 1 }]
      );

      const hasAdministrativeTaskPermission = responsibilities.some((responsibility) => {
        const role = responsibility.responsibility;
        const scope = responsibility.scope as any;
        const sameBranch = scope?.scope === "branch" && scope?.branchId === detail.task.branchId;
        const entityScope = scope?.scope === "entity";
        return (role === "owner" || role === "manager") && (entityScope || sameBranch);
      });

      setCanManageAssignments(hasAdministrativeTaskPermission);
    } catch {
      setCanManageAssignments(false);
    }
  };

  useEffect(() => {
    if (entityId) watchServiceAccess("checkinbiz");
  }, [entityId, watchServiceAccess]);

  useEffect(() => {
    loadDetail();
  }, [entityId, id]);

  useEffect(() => {
    resolveCurrentEmployee();
  }, [entityId, user?.id]);

  useEffect(() => {
    resolveAdministrativePermissions();
  }, [entityId, currentEmployeeId, detail?.task.branchId, currentEntity?.role]);

  return {
    detail,
    loading,
    saving,
    openForm,
    setOpenForm,
    action,
    setAction,
    currentEmployeeId,
    canManageAssignments,
    back,
    onUpdate,
    onStatus,
    onValidate,
    onRemoveAssignment,
    onActionSubmit,
  };
}
