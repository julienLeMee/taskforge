import { z } from "zod";

export const nextStepSchema = z.object({
  text: z.string().min(1, "Le texte ne peut pas être vide"),
  completed: z.boolean().default(false),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  status: z.string().default("En cours"),
  nextSteps: z.array(nextStepSchema).default([]),
  deployment: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
