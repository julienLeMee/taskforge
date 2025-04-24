export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "WAITING" | "COMPLETED" | undefined;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  timeframe: "TODAY" | "THIS_WEEK" | "UPCOMING" | undefined;
  isSupport: boolean;
  isMeeting: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  isDone: boolean;
};

export type TaskFormData = {
  title: string;
  description: string | null;
  status: Task["status"];
  priority: Task["priority"];
  timeframe: Task["timeframe"];
  isSupport: boolean;
  isMeeting: boolean;
  isDone: boolean;
};

export type TaskUpdateData = TaskFormData & {
  id: string;
};
