import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../../auth";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schéma de validation pour la réorganisation des projets
const reorderProjectsSchema = z.object({
  projects: z.array(z.object({
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
    const validationResult = reorderProjectsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Mise à jour de l'ordre des projets en une transaction
    await prisma.$transaction(
      validationResult.data.projects.map(({ id, order }) =>
        prisma.project.update({
          where: {
            id,
            userId // Vérifier que le projet appartient à l'utilisateur
          },
          data: {
            order
          } as Prisma.ProjectUpdateInput
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la réorganisation des projets:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la réorganisation des projets" },
      { status: 500 }
    );
  }
}
