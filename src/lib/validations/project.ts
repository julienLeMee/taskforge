import { z } from "zod";

// Schéma pour la création d'un projet
export const createProjectSchema = z.object({
  title: z.string().min(1, { message: "Le titre est requis" }).max(100),
  description: z.string().optional(),
});
