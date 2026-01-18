import { NextRequest, NextResponse } from "next/server";
import { auth } from "#/auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";

// Schéma de validation pour la réorganisation des notes
const reorderNotesSchema = z.object({
  notes: z.array(z.object({
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
    const validationResult = reorderNotesSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Mise à jour de l'ordre des notes en une transaction
    await prisma.$transaction(
      validationResult.data.notes.map(({ id, order }) =>
        prisma.note.update({
          where: {
            id,
            userId // Vérifier que la note appartient à l'utilisateur
          },
          data: {
            order
          } as Prisma.NoteUpdateInput
        })
      )
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la réorganisation des notes:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la réorganisation des notes" },
      { status: 500 }
    );
  }
}
