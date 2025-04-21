"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

// Type pour représenter une tâche
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "WAITING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  timeframe: "TODAY" | "THIS_WEEK" | "UPCOMING" | "BACKLOG";
  isSupport: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  return (
    <div className="space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des tâches</h1>
        <Button>Nouvelle tâche</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Chargement des tâches...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex justify-center items-center h-40 border rounded-md">
          <p className="text-muted-foreground">Aucune tâche pour le moment</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === "COMPLETED" ? "default" :
                        task.status === "IN_PROGRESS" ? "secondary" :
                        task.status === "WAITING" ? "outline" : "destructive"
                      }
                    >
                      {task.status === "TODO" ? "À faire" :
                       task.status === "IN_PROGRESS" ? "En cours" :
                       task.status === "WAITING" ? "En attente" : "Terminé"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.priority === "LOW" ? "outline" :
                        task.priority === "MEDIUM" ? "secondary" :
                        task.priority === "HIGH" ? "default" : "destructive"
                      }
                    >
                      {task.priority === "LOW" ? "Basse" :
                       task.priority === "MEDIUM" ? "Moyenne" :
                       task.priority === "HIGH" ? "Haute" : "Urgente"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.timeframe === "TODAY" ? "Aujourd'hui" :
                     task.timeframe === "THIS_WEEK" ? "Cette semaine" :
                     task.timeframe === "UPCOMING" ? "À venir" : "Backlog"}
                  </TableCell>
                  <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
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
