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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  key: string;
  summary: string;
  description: string;
  project: {
    key: string;
    name: string;
  };
  type: {
    name: string;
  };
  status: {
    name: string;
    category: string;
  };
  priority: string;
  assignee: {
    name: string;
    email: string;
  } | null;
  created: string;
  updated: string;
}

interface Assignee {
  name: string;
  email: string;
}

interface TaskListProps {
  myTasksOnly?: boolean;
  supportOnly?: boolean;
  projectKey?: string;
}

export function TaskList({ myTasksOnly = false, supportOnly = false, projectKey }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string>("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams();
        if (myTasksOnly) params.append('myTasks', 'true');
        if (supportOnly) params.append('support', 'true');
        if (projectKey) params.append('projectKey', projectKey);

        const response = await fetch(`/api/jira/tasks?${params.toString()}`);
        if (!response.ok) throw new Error("Erreur lors du chargement des tâches");

        const data = await response.json();
        setTasks(data.tasks);

        // Extraire les assignés uniques
        const uniqueAssignees = data.tasks
          .filter((task: Task) => task.assignee)
          .reduce((acc: Assignee[], task: Task) => {
            if (task.assignee && !acc.some(a => a.email === task.assignee?.email)) {
              acc.push(task.assignee);
            }
            return acc;
          }, [])
          .sort((a: Assignee, b: Assignee) => a.name.localeCompare(b.name));

        setAssignees(uniqueAssignees);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [myTasksOnly, supportOnly, projectKey]);

  const getStatusColor = (category: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-500',
      'indeterminate': 'bg-yellow-500',
      'done': 'bg-green-500',
    };
    return colors[category] || 'bg-slate-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Highest': 'bg-red-500',
      'High': 'bg-orange-500',
      'Medium': 'bg-yellow-500',
      'Low': 'bg-blue-500',
      'Lowest': 'bg-slate-500',
    };
    return colors[priority] || 'bg-slate-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredTasks = selectedAssignee === "ALL" || selectedAssignee === ""
    ? tasks
    : tasks.filter(task => task.assignee?.email === selectedAssignee);

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
              {selectedAssignee && selectedAssignee !== "ALL" && (
                <> | Filtrées : {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''}</>
              )}
            </>
          )}
        </div>
        {assignees.length > 0 && (
          <div className="flex items-center gap-2">
            <Select
              value={selectedAssignee}
              onValueChange={setSelectedAssignee}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par assigné" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les assignés</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.email} value={assignee.email}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAssignee && selectedAssignee !== "ALL" && (
              <Button
                variant="ghost"
                onClick={() => setSelectedAssignee("ALL")}
                className="h-8 px-2"
              >
                Réinitialiser
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clé</TableHead>
              <TableHead>Résumé</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Assigné</TableHead>
              <TableHead>Mis à jour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Link
                    href={`https://activis.atlassian.net/browse/${task.key}`}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {task.key}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {task.summary}
                </TableCell>
                <TableCell>{task.project.name}</TableCell>
                <TableCell>{task.type.name}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status.category)}>
                    {task.status.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.assignee?.name || "Non assigné"}
                </TableCell>
                <TableCell>
                  {formatDate(task.updated)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
