import { IEmployee, ResponsibilityKey } from "./IEmployee";
import { ISucursal } from "./ISucursal";
import IUser from "@/domain/core/auth/IUser";

export type TaskStatus =
  | "draft"
  | "assigned"
  | "in_progress"
  | "completed"
  | "validated"
  | "rejected"
  | "cancelled";

export type TaskTimeComplianceStatus =
  | "not_started"
  | "on_time"
  | "at_risk"
  | "overdue"
  | "completed_on_time"
  | "completed_late"
  | "rejected";

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskAssignmentStatus = "assigned" | "accepted" | "working" | "completed" | "blocked" | "removed";
export type TaskNoteType = "specification" | "operational_note" | "clarification" | "incident_note";
export type TaskResourceType = "photo" | "video";
export type TaskCompletionPolicy = "any_assigned_worker" | "all_assigned_workers";

export interface TaskConfig {
  allowSupervisorCreation: boolean;
  allowSupervisorValidation: boolean;
  allowSupervisorRating: boolean;
  completionPolicy: TaskCompletionPolicy;
  requireEvidenceOnCompletion: boolean;
  maxPhotoSizeMB: number;
  maxVideoSizeMB: number;
}

export interface Task {
  id?: string;
  entityId: string;
  branchId: string;
  branch?: ISucursal;
  title: string;
  description?: string;
  status: TaskStatus;
  timeComplianceStatus: TaskTimeComplianceStatus;
  priority?: TaskPriority;
  scheduledStartAt?: Date | string | any;
  dueAt: Date | string | any;
  startedAt?: Date | string | any;
  completedAt?: Date | string | any;
  validatedAt?: Date | string | any;
  rejectedAt?: Date | string | any;
  cancelledAt?: Date | string | any;
  createdBy: string;
  updatedBy?: string;
  completedBy?: string;
  validatedBy?: string;
  rejectedBy?: string;
  cancelledBy?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  assignedEmployeeIds: string[];
  config: TaskConfig;
  createdAt: Date | string | any;
  updatedAt: Date | string | any;
  dueSoonNotifiedAt?: Date | string | any;
  overdueNotifiedAt?: Date | string | any;
  totalItems?: number;
  last?: string;
}

export interface TaskAssignment {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  employeeId: string;
  employee?: IEmployee;
  status: TaskAssignmentStatus;
  assignedBy: string;
  assignedAt: Date | string | any;
  startedAt?: Date | string | any;
  completedAt?: Date | string | any;
  removedAt?: Date | string | any;
  notes?: string;
}

export interface TaskNote {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  content: string;
  type: TaskNoteType;
  createdBy: string;
  createdByName?: string;
  createdByRole: ResponsibilityKey;
  createdAt: Date | string | any;
  updatedBy?: string;
  updatedAt?: Date | string | any;
}

export interface TaskResource {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  uploadedBy: string;
  employeeId?: string;
  employee?: IEmployee;
  description?: string;
  type: TaskResourceType;
  filename: string;
  mimeType: string;
  url: string;
  storagePath: string;
  sizeKB: number;
  createdAt: Date | string | any;
}

export interface TaskRatingImage {
  filename: string;
  mimeType: string;
  url: string;
  storagePath: string;
  sizeKB: number;
}

export interface TaskRating {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  employeeId: string;
  employee?: IEmployee;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  image?: TaskRatingImage | null;
  ratedBy: string;
  ratedByName?: string;
  ratedByUser?: IUser;
  ratedByRole: Exclude<ResponsibilityKey, "worker">;
  ratedAt: Date | string | any;
}

export interface TaskValidation {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  result: "validated" | "rejected";
  reason?: string;
  validatedBy: string;
  validatedByRole: ResponsibilityKey;
  validatedAt: Date | string | any;
}

export interface TaskActivity {
  id?: string;
  taskId: string;
  entityId: string;
  branchId: string;
  type:
    | "created"
    | "updated"
    | "assigned"
    | "status_changed"
    | "started"
    | "completed"
    | "validated"
    | "rejected"
    | "cancelled"
    | "note_added"
    | "note_updated"
    | "resource_uploaded"
    | "rated"
    | "commented";
  actorId: string;
  actorRole: ResponsibilityKey;
  employeeId?: string;
  fromStatus?: string;
  toStatus?: string;
  metadata?: Record<string, any>;
  createdAt: Date | string | any;
}

export interface TaskDetail {
  task: Task;
  assignments: TaskAssignment[];
  notes: TaskNote[];
  resources: TaskResource[];
  ratings: TaskRating[];
  activity: TaskActivity[];
  validations: TaskValidation[];
}

export const defaultTaskConfig: TaskConfig = {
  allowSupervisorCreation: false,
  allowSupervisorValidation: true,
  allowSupervisorRating: true,
  completionPolicy: "any_assigned_worker",
  requireEvidenceOnCompletion: true,
  maxPhotoSizeMB: 5,
  maxVideoSizeMB: 25,
};
