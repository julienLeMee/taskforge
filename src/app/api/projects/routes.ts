import { prisma } from "@/lib/db";
import { auth } from "../../../../auth";
import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/validations/project";

// GET - Récupérer tous les projets de l'utilisateur
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau projet
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const json = await request.json();
    const validatedData = projectSchema.parse(json);

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
