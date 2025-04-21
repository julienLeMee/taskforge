// src/app/api/jira/issues/[key]/route.ts
import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth"; // Ajustez selon votre structure
import { jiraClient } from "@/lib/jira/jira-client";

// GET /api/jira/issues/[key] - Récupérer un ticket Jira spécifique
export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const issueKey = params.key;

    // Récupérer le ticket Jira
    const issue = await jiraClient.getIssue(issueKey);

    // Transformer les données Jira
    const formattedIssue = {
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
    };

    return NextResponse.json(formattedIssue);
  } catch (error) {
    console.error("Erreur lors de la récupération du ticket Jira:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du ticket Jira" },
      { status: 500 }
    );
  }
}
