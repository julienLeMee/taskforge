'use client';

import { TaskList } from "@/components/tasks/task-list"

export function TasksPage() {
  return (
    <div className="space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tâches</h2>
      </div>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <TaskList />
      </div>
    </div>
  )
}
