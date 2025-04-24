import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Task, TaskFormData, TaskUpdateData } from "../types";

interface BaseTaskFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface CreateTaskFormProps extends BaseTaskFormProps {
  mode: "create";
  task: TaskFormData;
  setTask: (task: TaskFormData) => void;
}

interface UpdateTaskFormProps extends BaseTaskFormProps {
  mode: "edit";
  task: TaskUpdateData;
  setTask: (task: TaskUpdateData) => void;
}

type TaskFormProps = CreateTaskFormProps | UpdateTaskFormProps;

export function TaskForm({
  isOpen,
  onOpenChange,
  onSubmit,
  task,
  setTask,
  mode,
}: TaskFormProps) {
  const title = mode === "create" ? "Créer une nouvelle priorité" : "Modifier la priorité";
  const description = mode === "create"
    ? "Remplissez les informations pour créer une nouvelle priorité."
    : "Modifiez les informations de la priorité.";
  const buttonText = mode === "create" ? "Créer la tâche" : "Mettre à jour";

  // Fonction pour convertir Task en TaskFormData si nécessaire
  const handleSetTask = (newValue: TaskFormData) => {
    if (mode === "create") {
      setTask(newValue);
    } else {
      setTask({ ...newValue, id: (task as TaskUpdateData).id });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isMeeting" className="text-right">
                Meeting
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="isMeeting"
                  checked={task.isMeeting}
                  onCheckedChange={(checked) => {
                    handleSetTask({
                      ...task,
                      isMeeting: checked as boolean,
                      ...(checked ? {
                        status: undefined,
                        timeframe: undefined,
                      } : {})
                    });
                  }}
                />
                <Label htmlFor="isMeeting">Cette tâche est un meeting</Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isSupport" className="text-right">
                Support
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="isSupport"
                  checked={task.isSupport}
                  onCheckedChange={(checked) =>
                    handleSetTask({ ...task, isSupport: checked as boolean })
                  }
                />
                <Label htmlFor="isSupport">Cette tâche est liée au support</Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                value={task.title}
                onChange={(e) => handleSetTask({ ...task, title: e.target.value })}
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
                value={task.description || ""}
                onChange={(e) => handleSetTask({ ...task, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={task.status || ""}
                onValueChange={(value) => handleSetTask({ ...task, status: value as Task["status"] })}
                disabled={task.isMeeting}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder={mode === "create" ? "À faire" : "Sélectionnez un statut"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">À faire</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="WAITING">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priorité
              </Label>
              <div className="col-span-3">
                <Select
                  value={task.priority}
                  onValueChange={(value: Task["priority"]) => handleSetTask({ ...task, priority: value })}
                >
                  <SelectTrigger id="priority" className="w-[200px]">
                    <SelectValue placeholder={mode === "create" ? "Moyenne" : "Sélectionnez une priorité"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Basse</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeframe" className="text-right">
                Échéance
              </Label>
              <Select
                value={task.timeframe || ""}
                onValueChange={(value) => handleSetTask({ ...task, timeframe: value as Task["timeframe"] })}
                disabled={task.isMeeting}
              >
                <SelectTrigger id="timeframe" className="col-span-3">
                  <SelectValue placeholder={mode === "create" ? "À venir" : "Sélectionnez une échéance"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODAY">Aujourd'hui</SelectItem>
                  <SelectItem value="THIS_WEEK">Cette semaine</SelectItem>
                  <SelectItem value="UPCOMING">À venir</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{buttonText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
