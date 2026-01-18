import React from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Project } from '../types';
import { ProjectRow } from './ProjectRow';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProjectListProps {
  projects: Project[];
  onReorder: (projects: Project[]) => void;
  onStatusChange: (projectId: string, newStatus: string) => void;
  onNextStepToggle: (projectId: string, stepText: string) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  showDeployment?: boolean;
}

export function ProjectList({
  projects,
  onReorder,
  onStatusChange,
  onNextStepToggle,
  onUpdateProject,
  onDeleteProject,
  showDeployment = true,
}: ProjectListProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((project) => project.id === active.id);
      const newIndex = projects.findIndex((project) => project.id === over.id);
      const newProjects = arrayMove(projects, oldIndex, newIndex);
      onReorder(newProjects);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Projet</TableHead>
            <TableHead className="w-[100px]">Statut</TableHead>
            <TableHead>Prochaines étapes</TableHead>
            {showDeployment && <TableHead className="w-[120px]">Déploiement</TableHead>}
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={projects.map(project => project.id)} strategy={verticalListSortingStrategy}>
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                onStatusChange={onStatusChange}
                onNextStepToggle={onNextStepToggle}
                onUpdateProject={onUpdateProject}
                onDeleteProject={onDeleteProject}
                showDeployment={showDeployment}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
