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
import { ProjectFormData, ProjectUpdateData } from "../types";
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

  const title = mode === "create" ? "Créer un nouveau projet" : "Modifier le projet";
  const description = mode === "create"
    ? "Ajoutez un nouveau projet à votre liste."
    : "Modifiez les détails de votre projet.";

  const handleProjectUpdate = (updates: Partial<typeof project>) => {
    if (mode === "create") {
      setProject({ ...project, ...updates } as ProjectFormData);
    } else {
      setProject({ ...project, ...updates } as ProjectUpdateData);
    }
  };

  const addNextStep = () => {
    if (!newStep.trim()) return;
    handleProjectUpdate({
      nextSteps: [...project.nextSteps, { text: newStep.trim(), completed: false }]
    });
    setNewStep("");
  };

  const removeNextStep = (index: number) => {
    handleProjectUpdate({
      nextSteps: project.nextSteps.filter((_, i) => i !== index)
    });
  };

  const toggleNextStep = (index: number) => {
    handleProjectUpdate({
      nextSteps: project.nextSteps.map((step, i) =>
        i === index ? { ...step, completed: !step.completed } : step
      )
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] h-[-webkit-fill-available] min-h-full overflow-y-auto">
        <form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader className="pb-4">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={project.title}
                onChange={(e) => handleProjectUpdate({ title: e.target.value })}
                placeholder="Nom du projet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={project.description || ""}
                onChange={(e) => handleProjectUpdate({ description: e.target.value })}
                placeholder="Description du projet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={project.status}
                onValueChange={(value) => handleProjectUpdate({ status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
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
                onChange={(e) => handleProjectUpdate({ deployment: e.target.value })}
                placeholder="Instructions de déploiement"
              />
            </div>

            <div className="space-y-2">
              <Label>Prochaines étapes</Label>
              <div className="flex gap-2">
                <Input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Nouvelle étape"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNextStep())}
                />
                <Button type="button" onClick={addNextStep} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {project.nextSteps.map((step, index) => (
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
                    <span className={`flex-1 ${step.completed ? "line-through text-muted-foreground" : ""}`}>
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
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit">
              {mode === "create" ? "Créer" : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
