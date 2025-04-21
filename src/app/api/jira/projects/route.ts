import { NextResponse } from "next/server";
import { auth as getAuth } from "@/../../auth";

interface JiraProject {
  id: string;
  key: string;
  name: string;
  description: string;
  url: string;
  lead: {
    displayName: string;
    emailAddress: string;
  };
  avatarUrls: {
    [key: string]: string;
  };
  projectType: string;
  simplified: boolean;
  style: string;
  isPrivate: boolean;
  properties?: Record<string, unknown>;
  categoryId?: number;
  assignee?: {
    displayName: string;
    emailAddress: string;
  };
}

interface JiraResponse {
  values: JiraProject[];
  total: number;
  isLast: boolean;
}

export async function GET() {
  try {
    const session = await getAuth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const jiraHost = process.env.JIRA_HOST?.replace(/\/$/, '');
    const jiraToken = process.env.JIRA_API_TOKEN;
    const jiraEmail = process.env.JIRA_EMAIL || session.user.email;

    if (!jiraHost || !jiraToken || !jiraEmail) {
      return NextResponse.json({
        error: "Configuration Jira manquante",
        details: {
          hasHost: !!jiraHost,
          hasToken: !!jiraToken,
          hasEmail: !!jiraEmail
        }
      }, { status: 500 });
    }

    const basicAuth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

    // Récupérer les projets avec des informations détaillées et catégories
    const response = await fetch(`${jiraHost}/rest/api/3/project/search?expand=description,lead,url,projectKeys,category&orderBy=name&maxResults=100`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Jira:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      return NextResponse.json({
        error: "Erreur lors de la récupération des projets",
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json() as JiraResponse;

    // Formater les données pour n'inclure que les informations nécessaires
    const formattedProjects = data.values.map((project: JiraProject) => ({
      id: project.id,
      key: project.key,
      name: project.name,
      description: project.description,
      url: project.url,
      lead: {
        displayName: project.lead.displayName,
        email: project.lead.emailAddress
      },
      avatarUrl: project.avatarUrls['48x48'],
      style: project.style,
      projectType: project.projectType,
      simplified: project.simplified,
      isPrivate: project.isPrivate,
      categoryId: project.categoryId,
      assignee: project.assignee
    }));

    // Log pour debug
    console.log("Projets trouvés:", formattedProjects.map(p => ({ key: p.key, name: p.name })));

    return NextResponse.json({
      message: "Projets récupérés avec succès",
      total: data.total,
      projects: formattedProjects
    });
  } catch (error) {
    console.error("Erreur complète:", error);
    return NextResponse.json({
      error: "Erreur lors de la récupération des projets",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
