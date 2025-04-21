import { NextResponse } from "next/server";
import { auth } from "#/auth";
import { prisma } from "@/lib/prisma";

export const GET = auth(async (req) => {
  try {
    const session = await auth();
    console.log("Session:", session);

    if (!session?.user) {
      console.log("No session or user found");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    console.log("User ID:", session.user.id);
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET] Detailed error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
});

export const POST = auth(async (req) => {
  try {
    const session = await auth();
    console.log("Session:", session);

    if (!session?.user) {
      console.log("No session or user found");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);
    const { title, description, status, nextSteps, deployment } = body;

    if (!title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        status: status || "En cours",
        nextSteps,
        deployment,
        userId: session.user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECTS_POST] Detailed error:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
});
