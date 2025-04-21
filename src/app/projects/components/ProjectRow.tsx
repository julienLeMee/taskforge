// src/app/projects/components/ProjectRow.tsx
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Project } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash } from "lucide-react";

interface ProjectRowProps {
  project: Project;
  onStatusChange: (id: string, newStatus: string) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectRow({
  project,
  onStatusChange,
  onUpdateProject,
  onDeleteProject,
}: ProjectRowProps) {
  return (
    <TableRow>
      <TableCell>{project.title}</TableCell>
      <TableCell>
        <Select
          value={project.status}
          onValueChange={(value) => onStatusChange(project.id, value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="En pause">En pause</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{project.deployment || "-"}</TableCell>
      <TableCell>
        {new Date(project.updatedAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUpdateProject(project)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteProject(project.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
