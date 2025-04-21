// src/app/tasks/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";

// Types
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "WAITING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  timeframe: "TODAY" | "THIS_WEEK" | "UPCOMING" | "BACKLOG";
  isSupport: boolean;
  createdAt: string;
  updatedAt: string;
};

type TaskFormData = Omit<Task, "id" | "createdAt" | "updatedAt">;

const defaultFormData: TaskFormData = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  timeframe: "TODAY",
  isSupport: false,
};

// Composant principal
export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Charger les tâches
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Erreur lors du chargement des tâches");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast.error("Impossible de charger les tâches");
    } finally {
      setLoading(false);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setFormData(defaultFormData);
      setIsDialogOpen(false);
      toast.success("Tâche créée avec succès");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
    }
  };

  // Supprimer une tâche
  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success("Tâche supprimée avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la tâche");
    }
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status: Task["status"]) => {
    const colors = {
      TODO: "bg-slate-500",
      IN_PROGRESS: "bg-blue-500",
      WAITING: "bg-yellow-500",
      COMPLETED: "bg-green-500",
    };
    return colors[status] || "bg-slate-500";
  };

  // Obtenir la couleur du badge selon la priorité
  const getPriorityBadgeColor = (priority: Task["priority"]) => {
    const colors = {
      LOW: "bg-slate-500",
      MEDIUM: "bg-blue-500",
      HIGH: "bg-orange-500",
      URGENT: "bg-red-500",
    };
    return colors[priority] || "bg-slate-500";
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des tâches</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nouvelle tâche</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle tâche</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select
                    id="status"
                    className="w-full border rounded-md p-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Task["status"] })}
                  >
                    <option value="TODO">À faire</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="WAITING">En attente</option>
                    <option value="COMPLETED">Terminé</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <select
                    id="priority"
                    className="w-full border rounded-md p-2"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task["priority"] })}
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Période</Label>
                  <select
                    id="timeframe"
                    className="w-full border rounded-md p-2"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value as Task["timeframe"] })}
                  >
                    <option value="TODAY">Aujourd'hui</option>
                    <option value="THIS_WEEK">Cette semaine</option>
                    <option value="UPCOMING">À venir</option>
                    <option value="BACKLOG">Backlog</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isSupport">Support</Label>
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      id="isSupport"
                      checked={formData.isSupport}
                      onChange={(e) => setFormData({ ...formData, isSupport: e.target.checked })}
                      className="mr-2"
                    />
                    <span>Tâche de support</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">Créer la tâche</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Période</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {task.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(task.status)}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadgeColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.timeframe}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toast.info("Fonctionnalité à venir")}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(task.id)}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
