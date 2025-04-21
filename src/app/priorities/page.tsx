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
import { Pencil, Trash2, Ellipsis } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Textarea } from "@/components/ui/textarea";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Skeleton } from "@/components/ui/skeleton";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
// Type pour représenter une tâche
type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "WAITING" | "COMPLETED" | undefined;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  timeframe: "TODAY" | "THIS_WEEK" | "UPCOMING" | "BACKLOG" | undefined;
  isSupport: boolean;
  isMeeting: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  isDone: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState<Task | null>(null);

  // État du formulaire
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: undefined as Task["status"],
    priority: "MEDIUM" as Task["priority"],
    timeframe: undefined as Task["timeframe"],
    isSupport: false,
    isMeeting: false,
    isDone: false,
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

  // Fonction pour créer une nouvelle tâche
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

      // Ajouter la nouvelle tâche à l'état
      setTasks([createdTask, ...tasks]);

      // Réinitialiser le formulaire
      setNewTask({
        title: "",
        description: "",
        status: undefined as Task["status"],
        priority: "MEDIUM" as Task["priority"],
        timeframe: undefined as Task["timeframe"],
        isSupport: false,
        isMeeting: false,
        isDone: false,
      });

      // Fermer le Dialog
      setIsDialogOpen(false);

      // Afficher un message toast
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

      // Optimistic update
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
        // Rollback on error
        setTasks(tasks.map(t => t.id === id ? {...t, isDone: !isDone, status: previousStatus} : t));
        throw new Error("Erreur lors de la mise à jour de la tâche");
      }

      const updatedTask = await response.json();
      // Update with server response
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
    setTaskToUpdate(task);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskToUpdate) return;

    try {
      const response = await fetch(`/api/tasks/${taskToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskToUpdate),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la tâche");
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
        description: "Erreur lors de la mise à jour de la tâche",
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

  return (
    <div className="space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Priorités</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-4 w-0.5 bg-primary rounded-full"></div>
              <span>Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-0.5 bg-secondary rounded-full"></div>
              <span>Meet</span>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>Nouvelle priorité</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateTask}>
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle priorité</DialogTitle>
                    <DialogDescription>
                    Remplissez les informations pour créer une nouvelle priorité.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isMeeting" className="text-right">
                            Réunion
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox
                            id="isMeeting"
                            checked={newTask.isMeeting}
                            onCheckedChange={(checked) => {
                                setNewTask({
                                    ...newTask,
                                    isMeeting: checked as boolean,
                                    // Reset status and timeframe if it's a meeting
                                    ...(checked ? {
                                        status: undefined,
                                        timeframe: undefined,
                                    } : {})
                                })
                            }}
                            />
                            <Label htmlFor="isMeeting">Cette tâche est une réunion</Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                        Titre
                    </Label>
                    <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="col-span-3"
                        required
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="col-span-3"
                        rows={3}
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Statut
                    </Label>
                    <Select
                        value={newTask.status || ""}
                        onValueChange={(value) => setNewTask({ ...newTask, status: value as Task["status"] })}
                        disabled={newTask.isMeeting}
                    >
                        <SelectTrigger id="status" className="col-span-3">
                        <SelectValue placeholder="Sélectionnez un statut" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="TODO">À faire</SelectItem>
                        <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                        <SelectItem value="WAITING">En attente</SelectItem>
                        <SelectItem value="COMPLETED">Terminé</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="priority" className="text-right">
                        Priorité
                    </Label>
                    <Select
                        value={newTask.priority}
                        onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                    >
                        <SelectTrigger id="priority" className="col-span-3">
                        <SelectValue placeholder="Sélectionnez une priorité" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="LOW">Basse</SelectItem>
                        <SelectItem value="MEDIUM">Moyenne</SelectItem>
                        <SelectItem value="HIGH">Haute</SelectItem>
                        <SelectItem value="URGENT">Urgente</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="timeframe" className="text-right">
                        Échéance
                    </Label>
                    <Select
                        value={newTask.timeframe || ""}
                        onValueChange={(value) => setNewTask({ ...newTask, timeframe: value as Task["timeframe"] })}
                        disabled={newTask.isMeeting}
                    >
                        <SelectTrigger id="timeframe" className="col-span-3">
                        <SelectValue placeholder="Sélectionnez une échéance" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="TODAY">Aujourd&apos;hui</SelectItem>
                        <SelectItem value="THIS_WEEK">Cette semaine</SelectItem>
                        <SelectItem value="UPCOMING">À venir</SelectItem>
                        <SelectItem value="BACKLOG">Backlog</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isSupport" className="text-right">
                            Support
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                            <Checkbox
                            id="isSupport"
                            checked={newTask.isSupport}
                            onCheckedChange={(checked) =>
                                setNewTask({ ...newTask, isSupport: checked as boolean })
                            }
                            />
                            <Label htmlFor="isSupport">Cette tâche est liée au support</Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Créer la tâche</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

      </div>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleUpdateSubmit}>
            <DialogHeader>
              <DialogTitle>Modifier la priorité</DialogTitle>
              <DialogDescription>
                Modifiez les informations de la priorité.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateIsMeeting" className="text-right">
                  Réunion
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="updateIsMeeting"
                    checked={taskToUpdate?.isMeeting}
                    onCheckedChange={(checked) => {
                      if (!taskToUpdate) return;
                      setTaskToUpdate({
                        ...taskToUpdate,
                        isMeeting: checked as boolean,
                        ...(checked ? {
                          status: undefined,
                          timeframe: undefined,
                        } : {})
                      });
                    }}
                  />
                  <Label htmlFor="updateIsMeeting">Cette tâche est une réunion</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateTitle" className="text-right">
                  Titre
                </Label>
                <Input
                  id="updateTitle"
                  value={taskToUpdate?.title}
                  onChange={(e) => taskToUpdate && setTaskToUpdate({ ...taskToUpdate, title: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="updateDescription"
                  value={taskToUpdate?.description || ""}
                  onChange={(e) => taskToUpdate && setTaskToUpdate({ ...taskToUpdate, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateStatus" className="text-right">
                  Statut
                </Label>
                <Select
                  value={taskToUpdate?.status || ""}
                  onValueChange={(value) => taskToUpdate && setTaskToUpdate({ ...taskToUpdate, status: value as Task["status"] })}
                  disabled={taskToUpdate?.isMeeting}
                >
                  <SelectTrigger id="updateStatus" className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">À faire</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="WAITING">En attente</SelectItem>
                    <SelectItem value="COMPLETED">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updatePriority" className="text-right">
                  Priorité
                </Label>
                <Select
                  value={taskToUpdate?.priority || "MEDIUM"}
                  onValueChange={(value) => taskToUpdate && setTaskToUpdate({ ...taskToUpdate, priority: value as Task["priority"] })}
                >
                  <SelectTrigger id="updatePriority" className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Basse</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateTimeframe" className="text-right">
                  Échéance
                </Label>
                <Select
                  value={taskToUpdate?.timeframe || ""}
                  onValueChange={(value) => taskToUpdate && setTaskToUpdate({ ...taskToUpdate, timeframe: value as Task["timeframe"] })}
                  disabled={taskToUpdate?.isMeeting}
                >
                  <SelectTrigger id="updateTimeframe" className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une échéance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODAY">Aujourd&apos;hui</SelectItem>
                    <SelectItem value="THIS_WEEK">Cette semaine</SelectItem>
                    <SelectItem value="UPCOMING">À venir</SelectItem>
                    <SelectItem value="BACKLOG">Backlog</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="updateIsSupport" className="text-right">
                  Support
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="updateIsSupport"
                    checked={taskToUpdate?.isSupport}
                    onCheckedChange={(checked) =>
                      taskToUpdate && setTaskToUpdate({ ...taskToUpdate, isSupport: checked as boolean })
                    }
                  />
                  <Label htmlFor="updateIsSupport">Cette tâche est liée au support</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Mettre à jour</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className={`${task.isDone ? "bg-muted" : ""}`}>
                  <TableCell className={`${
                    task.isSupport ? "border-l-2 border-primary" :
                    task.isMeeting ? "border-l-2 border-secondary" : ""
                    }`}>
                    <Checkbox
                      id={task.id}
                      checked={task.isDone}
                      onCheckedChange={(checked) => {
                        setTasks(tasks.map(t => t.id === task.id ? {...t, isDone: checked as boolean} : t));
                        handleTaskDoneChange(task.id, checked as boolean);
                      }}
                    />
                  </TableCell>
                  <TableCell className={`font-medium ${task.isDone ? "line-through" : ""}`}>
                    {task.title}
                  </TableCell>
                  <TableCell>
                    {task.isMeeting ? ("-") : task.status ? (
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
                    ) : null}
                  </TableCell>
                  <TableCell className={`${task.isDone ? "line-through" : ""}`}>
                    {task.isMeeting ? ("-") : task.timeframe ? (
                      task.timeframe === "TODAY" ? "Aujourd'hui" :
                      task.timeframe === "THIS_WEEK" ? "Cette semaine" :
                      task.timeframe === "UPCOMING" ? "À venir" : "Backlog"
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {task.isMeeting ? ("-") : task.priority ? (
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
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleUpdateTask(task.id, task)} className="cursor-pointer">
                          <Pencil className="h-4 w-4" />
                          <span className="">Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                          <span className="">Supprimer</span>
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
