import { Prisma } from "@prisma/client";
import { auth } from "#/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Récupérer une note par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const note = await prisma.note.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note non trouvée" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("[NOTE_GET]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// PATCH - Mettre à jour une note
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const json = await request.json();
    const { title, content } = json;

    // Vérifier si la note existe et appartient à l'utilisateur
    const existingNote = await prisma.note.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingNote) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content: content as Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue }),
      }
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // Vérifier si la note existe et appartient à l'utilisateur
    const existingNote = await prisma.note.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingNote) {
      return NextResponse.json({ message: "Note non trouvée" }, { status: 404 });
    }

    await prisma.note.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Note supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
