import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFormData, ProjectUpdateData, NextStep } from "../types";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface BaseProjectFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface CreateProjectFormProps extends BaseProjectFormProps {
  mode: "create";
  task: ProjectFormData;
  setTask: (task: ProjectFormData) => void;
}

interface UpdateProjectFormProps extends BaseProjectFormProps {
  mode: "edit";
  task: ProjectUpdateData;
  setTask: (task: ProjectUpdateData) => void;
}

type ProjectFormProps = CreateProjectFormProps | UpdateProjectFormProps;

export function ProjectForm({
  isOpen,
  onOpenChange,
  onSubmit,
  task: project,
  setTask: setProject,
  mode,
}: ProjectFormProps) {
  const [newStep, setNewStep] = useState("");

  const description = mode === "create"
    ? "Remplissez les informations pour créer un nouveau projet"
    : "Modifiez les informations du projet";

  const handleUpdate = (updates: Partial<ProjectFormData>) => {
    if (mode === "create") {
      setProject({
        ...project,
        ...updates,
      } as ProjectFormData);
    } else {
      setProject({
        ...project,
        ...updates,
      } as ProjectUpdateData);
    }
  };

  const addNextStep = () => {
    if (!newStep.trim()) return;
    const newStepObj: NextStep = {
      text: newStep.trim(),
      completed: false,
    };
    handleUpdate({
      nextSteps: [...(project.nextSteps || []), newStepObj],
    });
    setNewStep("");
  };

  const removeNextStep = (index: number) => {
    const updatedSteps = [...(project.nextSteps || [])];
    updatedSteps.splice(index, 1);
    handleUpdate({ nextSteps: updatedSteps });
  };

  const toggleNextStep = (index: number) => {
    const updatedSteps = [...(project.nextSteps || [])];
    updatedSteps[index] = {
      ...updatedSteps[index],
      completed: !updatedSteps[index].completed,
    };
    handleUpdate({ nextSteps: updatedSteps });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nouveau projet" : "Modifier le projet"}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={project.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              placeholder="Nom du projet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={project.description || ""}
              onChange={(e) => handleUpdate({ description: e.target.value })}
              placeholder="Description du projet"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={project.status}
              onValueChange={(value) => handleUpdate({ status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="En pause">En pause</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deployment">Déploiement</Label>
            <Textarea
              id="deployment"
              value={project.deployment || ""}
              onChange={(e) => handleUpdate({ deployment: e.target.value })}
              placeholder="Informations de déploiement (URL, instructions, etc.)"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Prochaines étapes</Label>
            <div className="flex gap-2">
              <Input
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Ajouter une étape"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNextStep();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addNextStep}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {(project.nextSteps || []).map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => toggleNextStep(index)}
                    className="h-4 w-4"
                  />
                  <span
                    className={`flex-1 ${
                      step.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {step.text}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeNextStep(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit">
              {mode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
