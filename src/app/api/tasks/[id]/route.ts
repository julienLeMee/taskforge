import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../../auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour d'une tâche
const updateTaskSchema = z.object({
  title: z.string().min(1, "Le titre est requis").optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "WAITING", "COMPLETED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  timeframe: z.enum(["TODAY", "THIS_WEEK", "UPCOMING", "BACKLOG"]).optional(),
  dueDate: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  isSupport: z.boolean().optional(),
  isMeeting: z.boolean().optional(),
  isDone: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = updateTaskSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({
      where: { id, userId: session.user.id },
      data: validationResult.data,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour de la tâche" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const task = await prisma.task.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
    }

    // Supprimer la tâche
    await prisma.task.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: "Tâche supprimée" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression de la tâche" },
      { status: 500 }
    );
  }
}
