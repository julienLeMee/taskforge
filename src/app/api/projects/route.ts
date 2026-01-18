import { NextRequest, NextResponse } from "next/server";
import { auth } from "#/auth";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { order: 'asc' } as Prisma.ProjectOrderByWithRelationInput,
        { updatedAt: 'desc' }
      ],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET] Detailed error:", error);
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
    const { title, description, status, nextSteps, deployment } = body;

    if (!title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title: title as string,
        description: description as string | null,
        status: (status || "En cours") as string,
        nextSteps: nextSteps as Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined,
        deployment: deployment as string | null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST] Detailed error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
