'use client';

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Task {
  id: string;
  key: string;
  summary: string;
  description: string;
  project: {
    key: string;
    name: string;
  };
  dueDate: string | null;
}

interface TaskListProps {
  myTasksOnly?: boolean;
  supportOnly?: boolean;
  projectKey?: string;
}

export function TaskList({ myTasksOnly = false, supportOnly = false, projectKey }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams();
        params.append('myTasks', 'true');
        if (supportOnly) params.append('support', 'true');
        if (projectKey) params.append('projectKey', projectKey);

        const response = await fetch(`/api/jira/tasks?${params.toString()}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erreur détaillée:", errorData);
          throw new Error(errorData.error || "Erreur lors du chargement des tâches");
        }

        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [myTasksOnly, supportOnly, projectKey]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-sm text-muted-foreground">
        {tasks.length > 0 && (
          <>
            Total : {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
          </>
        )}
      </div>

      <div className="w-full border rounded-md">
        <div className="min-w-full table-fixed">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Clé</TableHead>
                <TableHead className="w-[60%]">Résumé</TableHead>
                <TableHead className="w-32">Projet</TableHead>
                <TableHead className="w-32">Échéance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`https://activis.atlassian.net/browse/${task.key}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {task.key}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-0 overflow-hidden text-ellipsis">
                    {task.summary}
                  </TableCell>
                  <TableCell className="truncate">
                    {task.project.name}
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? formatDate(task.dueDate) : "Non définie"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
