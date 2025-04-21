// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/../../auth";
import { PrismaClient } from "@prisma/client";

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
