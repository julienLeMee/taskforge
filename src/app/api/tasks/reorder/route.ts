import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../../auth";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la réorganisation des tâches
const reorderTasksSchema = z.object({
  tasks: z.array(z.object({
    id: z.string(),
    order: z.number()
  }))
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = reorderTasksSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Mise à jour de l'ordre des tâches en une transaction
    await prisma.$transaction(
      validationResult.data.tasks.map(({ id, order }) =>
        prisma.task.update({
          where: {
            id,
            userId // Vérifier que la tâche appartient à l'utilisateur
          },
          data: {
            order
          } as Prisma.TaskUpdateInput
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la réorganisation des tâches:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la réorganisation des tâches" },
      { status: 500 }
    );
  }
}
