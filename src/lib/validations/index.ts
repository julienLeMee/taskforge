import { z } from "zod";

/**
 * Schéma de validation pour l'email
 */
export const emailSchema = z
  .string()
  .min(1, { message: "L'email est requis" })
  .email({ message: "Format d'email invalide" });

/**
 * Schéma de validation pour les mots de passe
 */
export const passwordSchema = z
  .string()
  .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
  .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
  .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une minuscule" })
  .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" });

/**
 * Préparation pour les exports futurs des schémas spécifiques
 */
