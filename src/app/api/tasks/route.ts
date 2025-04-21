// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/../../auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// GET /api/tasks - Récupérer toutes les tâches de l'utilisateur
export async function GET() {
  try {
    // 1. Vérifier l'authentification (l'utilisateur doit être connecté)
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2. Récupérer les tâches de l'utilisateur depuis la base de données
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 3. Retourner les tâches au format JSON
    return NextResponse.json(tasks);
  } catch (error) {
    // 4. Gestion des erreurs
    console.error("Erreur lors de la récupération des tâches:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des tâches" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Créer une nouvelle tâche
// Schéma de validation pour la création d'une tâche
const createTaskSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "WAITING", "COMPLETED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    timeframe: z.enum(["TODAY", "THIS_WEEK", "UPCOMING", "BACKLOG"]).optional(),
    dueDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
    isSupport: z.boolean().optional(),
  });

  // POST /api/tasks - Créer une nouvelle tâche
export async function POST(request: Request) {
    try {
      const session = await auth();

      if (!session?.user?.id) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }

      const body = await request.json();
      const validationResult = createTaskSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          { error: validationResult.error.errors[0].message },
          { status: 400 }
        );
      }

      const task = await prisma.task.create({
        data: {
          ...validationResult.data,
          userId: session.user.id,
        },
      });

      return NextResponse.json(task, { status: 201 });
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      return NextResponse.json(
        { error: "Une erreur est survenue lors de la création de la tâche" },
        { status: 500 }
      );
    }
  }
