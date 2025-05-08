import { PrismaClient } from "@prisma/client";
import { auth } from "#/auth";
import { NextRequest, NextResponse } from "next/server";
import { projectSchema } from "@/lib/validations/project";

const prisma = new PrismaClient();

// GET - Récupérer un projet par son ID
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

    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Projet non trouvé" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// PATCH - Mettre à jour un projet
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

    let json = await request.json();

    // Si on met à jour uniquement le statut, on utilise un schéma différent
    if (Object.keys(json).length === 1 && 'status' in json) {
      if (!['En cours', 'En pause', 'Terminé'].includes(json.status)) {
        return NextResponse.json(
          { message: "Statut invalide" },
          { status: 400 }
        );
      }
    } else {
      // Assurez-vous que les champs optionnels sont explicitement null s'ils sont vides
      const dataToValidate = {
        ...json,
        description: json.description || null,
        deployment: json.deployment || null,
        nextSteps: Array.isArray(json.nextSteps) ? json.nextSteps : [],
      };

      try {
        projectSchema.parse(dataToValidate);
      } catch (error) {
        console.error("Erreur de validation:", error);
        return NextResponse.json(
          { message: "Données invalides", error },
          { status: 400 }
        );
      }

      json = dataToValidate; // Utiliser les données nettoyées
    }

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
      data: json
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

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
