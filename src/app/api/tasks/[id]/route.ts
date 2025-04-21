import { NextResponse } from "next/server";
import { auth } from "@/../../auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que la tâche existe et appartient à l'utilisateur
    const task = await prisma.task.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
    }

    // Supprimer la tâche
    await prisma.task.delete({
      where: {
        id: params.id,
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
