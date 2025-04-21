import { prisma } from "@/lib/db";
import { auth } from "../../../../../auth";
import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/validations/project";

// GET - Récupérer un projet par son ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;

    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!project) {
      return NextResponse.json({ message: "Projet non trouvé" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour un projet
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;
    const json = await request.json();
    const validatedData = projectSchema.parse(json);

    // Vérifier si le projet existe et appartient à l'utilisateur
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingProject) {
      return NextResponse.json({ message: "Projet non trouvé" }, { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un projet
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;

    // Vérifier si le projet existe et appartient à l'utilisateur
    const existingProject = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!existingProject) {
      return NextResponse.json({ message: "Projet non trouvé" }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
