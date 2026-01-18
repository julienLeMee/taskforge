import { NextRequest, NextResponse } from "next/server";
import { auth } from "#/auth";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { order: 'asc' } as Prisma.NoteOrderByWithRelationInput,
        { updatedAt: 'desc' }
      ],
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("[NOTES_GET] Detailed error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: {
        title: title as string,
        content: content as Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined,
        userId: session.user.id,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("[NOTES_POST] Detailed error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
