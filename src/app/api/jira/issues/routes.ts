// src/app/api/jira/issues/route.ts
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth"; // Ajustez selon votre structure
import { jiraClient } from "@/lib/jira/jira-client";

// GET /api/jira/issues - Récupérer les tickets Jira assignés à l'utilisateur
export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les tickets Jira
    const issues = await jiraClient.getMyIssues();

    // Transformer les données Jira en format plus simple pour le frontend
    const formattedIssues = issues.map(issue => ({
      id: issue.id,
      key: issue.key,
      title: issue.fields.summary,
      description: issue.fields.description || null,
      status: issue.fields.status.name,
      statusCategory: issue.fields.status.statusCategory.name,
      statusColor: issue.fields.status.statusCategory.colorName,
      priority: issue.fields.priority?.name || null,
      assignee: issue.fields.assignee?.displayName || null,
      created: issue.fields.created,
      updated: issue.fields.updated,
      dueDate: issue.fields.duedate || null,
      url: `${process.env.JIRA_HOST}/browse/${issue.key}`
    }));

    return NextResponse.json(formattedIssues);
  } catch (error) {
    console.error("Erreur lors de la récupération des tickets Jira:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des tickets Jira" },
      { status: 500 }
    );
  }
}
