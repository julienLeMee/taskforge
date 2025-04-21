// src/app/projects/components/ProjectRow.tsx
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Project } from "../types";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Ellipsis } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProjectRowProps {
  project: Project;
  onStatusChange: (id: string, newStatus: string) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectRow({
  project,
//   onStatusChange,
  onUpdateProject,
  onDeleteProject,
}: ProjectRowProps) {
  return (
    <TableRow>
      <TableCell>{project.title}</TableCell>
      <TableCell>
        {/* badge */}
        <Badge variant="outline">{project.status}</Badge>
      </TableCell>
      <TableCell>
        {project.nextSteps && project.nextSteps.length > 0 ? (
          <div className="space-y-1">
            {project.nextSteps.map((step, index) => (
              <div
                key={index}
                className={`text-sm ${
                  step.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                • {step.text}
              </div>
            ))}
          </div>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell>{project.deployment || "-"}</TableCell>
      <TableCell className="text-right space-x-2">
        {/* dropdown */}
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
