"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { Task, TaskFormData, TaskUpdateData } from "./types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState<TaskUpdateData | null>(null);

  // État du formulaire
  const [newTask, setNewTask] = useState<TaskFormData>({
    title: "",
    description: null,
    status: undefined,
    priority: "MEDIUM",
    timeframe: undefined,
    isSupport: false,
    isMeeting: false,
    isDone: false,
    link: null,
  });

  // Charger les tâches au chargement de la page
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des tâches");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les tâches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [toast]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création de la tâche");
      }

      const createdTask = await response.json();
      setTasks([createdTask, ...tasks]);
      setNewTask({
        title: "",
        description: null,
        status: undefined,
        priority: "MEDIUM",
        timeframe: undefined,
        isSupport: false,
        isMeeting: false,
        isDone: false,
        link: null,
      });
      setIsDialogOpen(false);
      toast({
        title: "Tâche créée",
        description: "La tâche a été créée avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création de la tâche",
        variant: "destructive",
      });
    }
  };

  const handleTaskDoneChange = async (id: string, isDone: boolean) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const previousStatus = task.status;
      const newStatus = isDone ? "COMPLETED" as const : (previousStatus === "COMPLETED" ? "TODO" as const : previousStatus);

      setTasks(tasks.map(t => t.id === id ? {...t, isDone, status: newStatus} : t));

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDone,
          status: newStatus
        }),
      });

      if (!response.ok) {
        setTasks(tasks.map(t => t.id === id ? {...t, isDone: !isDone, status: previousStatus} : t));
        throw new Error("Erreur lors de la mise à jour de la tâche");
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la tâche",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (id: string, task: Task) => {
    const formData: TaskUpdateData = {
      id,
      title: task.title,
      description: task.description,
      status: task.status || undefined,
      priority: task.priority,
      timeframe: task.timeframe || undefined,
      isSupport: task.isSupport,
      isMeeting: task.isMeeting,
      isDone: task.isDone,
      link: task.link
    };
    setTaskToUpdate(formData);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToUpdate) return;

    try {
      const updateData = Object.fromEntries(
        Object.entries(taskToUpdate)
          .filter(([key, value]) => key !== 'id' && value !== undefined)
      ) as Partial<TaskUpdateData>;

      const response = await fetch(`/api/tasks/${taskToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour de la tâche");
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setIsUpdateDialogOpen(false);
      setTaskToUpdate(null);

      toast({
        title: "Succès",
        description: "La tâche a été mise à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour de la tâche",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la tâche");
      }
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la tâche",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut");
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  const handlePriorityUpdate = async (taskId: string, newPriority: Task["priority"]) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la priorité");
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

      toast({
        title: "Succès",
        description: "La priorité a été mise à jour",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la priorité",
        variant: "destructive",
      });
    }
  };

  const handleTimeframeUpdate = async (taskId: string, newTimeframe: Task["timeframe"]) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ timeframe: newTimeframe }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'échéance");
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

      toast({
        title: "Succès",
        description: "L'échéance a été mise à jour",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'échéance",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      // Optionally, you can save the new order to your backend
      // await fetch("/api/tasks/reorder", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ tasks: newTasks }),
      // });
    } catch (error) {
      console.error("Error saving task order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre des tâches",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Priorités</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-4 w-0.5 bg-primary rounded-full"></div>
              <span>Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-0.5 dark:bg-secondary bg-foreground rounded-full"></div>
              <span>Meet</span>
            </div>
          </div>
        </div>

        <Button onClick={() => setIsDialogOpen(true)}>Nouvelle priorité</Button>

        <TaskForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateTask}
          task={newTask}
          setTask={setNewTask}
          mode="create"
        />

        {taskToUpdate && (
          <TaskForm
            isOpen={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            onSubmit={handleUpdateSubmit}
            task={taskToUpdate}
            setTask={(task) => setTaskToUpdate(task as TaskUpdateData)}
            mode="edit"
          />
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex justify-center items-center h-40 border rounded-md">
          <p className="text-muted-foreground">Aucune tâche pour le moment</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <TaskList
            tasks={tasks}
            onReorder={handleReorder}
                  onStatusChange={handleStatusUpdate}
                  onPriorityChange={handlePriorityUpdate}
                  onTimeframeChange={handleTimeframeUpdate}
                  onTaskDoneChange={handleTaskDoneChange}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
        </div>
      )}
    </div>
  );
}
