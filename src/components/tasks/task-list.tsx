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
        // Toujours récupérer mes tâches
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {tasks.length > 0 && (
            <>
              Total : {tasks.length} tâche{tasks.length > 1 ? 's' : ''}
            </>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Clé</TableHead>
                <TableHead className="min-w-[400px]">Résumé</TableHead>
                <TableHead className="w-[100px]">Projet</TableHead>
                <TableHead className="w-[120px]">Date d&apos;échéance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="whitespace-nowrap">
                    <Link
                      href={`https://activis.atlassian.net/browse/${task.key}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {task.key}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[400px] truncate">
                    {task.summary}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{task.project.name}</TableCell>
                  <TableCell className="whitespace-nowrap">
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
