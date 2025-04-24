"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectList } from "./components/ProjectList";
import { Project, ProjectFormData, ProjectUpdateData } from "./types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<ProjectUpdateData | null>(null);

  // État du formulaire
  const [newProject, setNewProject] = useState<ProjectFormData>({
    title: "",
    description: null,
    status: "En cours",
    nextSteps: [],
    deployment: null,
  });

  // Charger les projets au chargement de la page
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des projets");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les projets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création du projet");
      }

      const createdProject = await response.json();
      setProjects([createdProject, ...projects]);
      setNewProject({
        title: "",
        description: null,
        status: "En cours",
        nextSteps: [],
        deployment: null,
      });
      setIsDialogOpen(false);
      toast({
        title: "Projet créé",
        description: "Le projet a été créé avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création du projet",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProject = async (project: Project) => {
    const formData: ProjectUpdateData = {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      nextSteps: project.nextSteps,
      deployment: project.deployment,
    };
    setProjectToUpdate(formData);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToUpdate) return;

    try {
      const response = await fetch(`/api/projects/${projectToUpdate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectToUpdate),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du projet");
      }

      const updatedProject = await response.json();
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setIsUpdateDialogOpen(false);
      setProjectToUpdate(null);

      toast({
        title: "Succès",
        description: "Le projet a été mis à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du projet",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du projet");
      }
      setProjects(projects.filter(project => project.id !== id));
      toast({
        title: "Succès",
        description: "Le projet a été supprimé avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du projet",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (projectId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut");
      }

      const updatedProject = await response.json();
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));

      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  const handleNextStepToggle = async (projectId: string, stepText: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const updatedNextSteps = project.nextSteps.map(step =>
        step.text === stepText ? { ...step, completed: !step.completed } : step
      );

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          status: project.status,
          nextSteps: updatedNextSteps,
          deployment: project.deployment
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'étape");

      const updatedProject = await response.json();
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'étape",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      // Optionally, you can save the new order to your backend
      // await fetch("/api/projects/reorder", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ projects: newProjects }),
      // });
    } catch (error) {
      console.error("Error saving project order:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre des projets",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projets</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Nouveau projet</Button>

        <ProjectForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateProject}
          task={newProject}
          setTask={(task: ProjectFormData) => setNewProject(task)}
          mode="create"
        />

        {projectToUpdate && (
          <ProjectForm
            isOpen={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
            onSubmit={handleUpdateSubmit}
            task={projectToUpdate}
            setTask={(task: ProjectUpdateData) => setProjectToUpdate(task)}
            mode="edit"
          />
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex justify-center items-center h-40 border rounded-md">
          <p className="text-muted-foreground">Aucun projet pour le moment</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <ProjectList
            projects={projects}
            onReorder={handleReorder}
                  onStatusChange={handleStatusUpdate}
                  onNextStepToggle={handleNextStepToggle}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                />
        </div>
      )}
    </div>
  );
}
