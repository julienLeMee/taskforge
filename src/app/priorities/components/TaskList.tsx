import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Task } from '../types';
import { TaskRow } from './TaskRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TaskListProps {
  tasks: Task[];
  onReorder: (tasks: Task[]) => void;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onPriorityChange: (taskId: string, newPriority: Task["priority"]) => void;
  onTimeframeChange: (taskId: string, newTimeframe: Task["timeframe"]) => void;
  onTaskDoneChange: (taskId: string, isDone: boolean) => void;
  onUpdateTask: (taskId: string, task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({
  tasks,
  onReorder,
  onStatusChange,
  onPriorityChange,
  onTimeframeChange,
  onTaskDoneChange,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      onReorder(newTasks);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Tâche</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onPriorityChange={onPriorityChange}
                onTimeframeChange={onTimeframeChange}
                onTaskDoneChange={onTaskDoneChange}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
