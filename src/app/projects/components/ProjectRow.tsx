// src/app/projects/components/ProjectRow.tsx
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Project } from "../types";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Ellipsis, GripVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectRowProps {
  project: Project;
  onStatusChange: (projectId: string, newStatus: string) => void;
  onNextStepToggle: (projectId: string, stepText: string) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  showDeployment?: boolean;
}

export function ProjectRow({
  project,
  onStatusChange,
  onNextStepToggle,
  onUpdateProject,
  onDeleteProject,
  showDeployment = true,
}: ProjectRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: project.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? "z-50" : ""}>
      <TableCell>
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <span
            onClick={() => onUpdateProject(project)}
            className="cursor-pointer hover:underline"
          >
            {project.title}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge
              className="cursor-pointer hover:opacity-80"
              variant={
                project.status === "En cours" ? "primary" :
                project.status === "En pause" ? "secondary" :
                project.status === "Terminé" ? "outline" : "default"
              }
            >
              {project.status}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onStatusChange(project.id, "En cours")}>
              <Badge variant="primary">En cours</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(project.id, "En pause")}>
              <Badge variant="secondary">En pause</Badge>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(project.id, "Terminé")}>
              <Badge variant="outline">Terminé</Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell>
        {project.nextSteps && project.nextSteps.length > 0 ? (
          <div className="space-y-1 max-w-full">
            {project.nextSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 text-sm ${
                  step.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                <Checkbox
                  checked={step.completed}
                  onCheckedChange={() => onNextStepToggle(project.id, step.text)}
                  className="h-4 w-4 mt-0.5 shrink-0"
                />
                <span className="whitespace-normal break-words">{step.text}</span>
              </div>
            ))}
          </div>
        ) : (
          "-"
        )}
      </TableCell>
      {showDeployment && (
        <TableCell>
          <div className="whitespace-pre-wrap max-h-[100px] overflow-y-auto">
            {project.deployment || "-"}
          </div>
        </TableCell>
      )}
      <TableCell className="text-right space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdateProject(project)} className="cursor-pointer">
              <Edit className="h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteProject(project.id)} className="cursor-pointer">
              <Trash className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
