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
            <Input
              id="deployment"
              value={project.deployment || ""}
              onChange={(e) => handleUpdate({ deployment: e.target.value })}
              placeholder="URL de déploiement"
            />
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
