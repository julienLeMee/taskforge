import { NextResponse } from "next/server";
import { auth as getAuth } from "@/../../auth";

// Types pour les tâches Jira
interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    project: {
      id: string;
      key: string;
      name: string;
    };
    issuetype: {
      id: string;
      name: string;
      description: string;
    };
    status: {
      name: string;
      statusCategory: {
        key: string;
      };
    };
    priority: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    created: string;
    updated: string;
    customfield_10014?: string; // Champ sprint
    [key: string]: unknown;
  };
}

// GET - Récupérer les tâches (avec filtres)
export async function GET(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');
    const isSupportTask = searchParams.get('support') === 'true';
    const myTasks = searchParams.get('myTasks') === 'true';

    const jiraHost = process.env.JIRA_HOST?.replace(/\/$/, '');
    const jiraToken = process.env.JIRA_API_TOKEN;
    const jiraEmail = process.env.JIRA_EMAIL || session.user.email;

    if (!jiraHost || !jiraToken || !jiraEmail) {
      console.error("Configuration manquante:", {
        jiraHost: !!jiraHost,
        jiraToken: !!jiraToken,
        jiraEmail: jiraEmail
      });
      return NextResponse.json({
        error: "Configuration Jira manquante",
        details: {
          hasHost: !!jiraHost,
          hasToken: !!jiraToken,
          hasEmail: !!jiraEmail,
          email: jiraEmail
        }
      }, { status: 500 });
    }

    const basicAuth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

    // Construire la requête JQL
    const jqlParts = [];

    if (projectKey) {
      jqlParts.push(`project = "${projectKey}"`);
    }

    if (isSupportTask) {
      jqlParts.push('issuetype = "SOUTIEN"');
    }

    // Toujours filtrer par l'assignee
    jqlParts.push(`assignee = "${jiraEmail}"`);

    // Exclure les tâches fermées (utiliser la catégorie de statut au lieu du statut spécifique)
    jqlParts.push('statusCategory != Done');

    // Construire la requête JQL finale
    let jql = jqlParts.length > 0 ? jqlParts.join(' AND ') : '';

    // Ajouter le tri par date d'échéance
    jql += ' ORDER BY duedate ASC';

    console.log("Configuration Jira:", {
      host: jiraHost,
      email: jiraEmail,
      hasToken: !!jiraToken
    });
    console.log("Requête JQL:", jql);

    const response = await fetch(
      `${jiraHost}/rest/api/3/search?jql=${encodeURIComponent(jql)}&expand=names,schema&maxResults=10000`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Jira:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        jql
      });
      return NextResponse.json({
        error: "Erreur lors de la récupération des tâches",
        details: errorText,
        debug: { jql }
      }, { status: response.status });
    }

    const data = await response.json();
    // console.log("Total tasks from Jira:", data.total);
    // console.log("Number of issues received:", data.issues.length);
    // console.log("Current user email:", jiraEmail);

    // Formater les tâches pour l'affichage
    const formattedIssues = data.issues
      .filter((issue: JiraIssue) => {
        const matches = issue.fields.assignee?.emailAddress === jiraEmail;
        if (matches) {
          console.log("Matched task:", issue.key, "Assignee email:", issue.fields.assignee?.emailAddress);
        }
        return matches;
      })
      .map((issue: JiraIssue) => {
      return {
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        project: {
        id: issue.fields.project.id,
        key: issue.fields.project.key,
        name: issue.fields.project.name
      },
      type: {
        id: issue.fields.issuetype.id,
        name: issue.fields.issuetype.name
      },
      status: {
        name: issue.fields.status.name,
        category: issue.fields.status.statusCategory.key
      },
      priority: issue.fields.priority.name,
      assignee: issue.fields.assignee ? {
        name: issue.fields.assignee.displayName,
        email: issue.fields.assignee.emailAddress
      } : null,
      created: issue.fields.created,
      dueDate: issue.fields.duedate,
        sprint: issue.fields.customfield_10014
      };
    });

    console.log("Formatted issues:", formattedIssues);

    return NextResponse.json({
      message: "Tâches récupérées avec succès",
      total: data.total,
      tasks: formattedIssues,
      filters: {
        supportTasksOnly: isSupportTask,
        myTasksOnly: myTasks,
        projectKey
      }
    });

  } catch (error) {
    console.error("Erreur complète:", error);
    return NextResponse.json({
      error: "Erreur lors de la récupération des tâches",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}

// POST - Créer une nouvelle tâche
export async function POST(request: Request) {
  try {
    const session = await getAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { projectKey, summary, description, isSupport } = body;

    const jiraHost = process.env.JIRA_HOST?.replace(/\/$/, '');
    const jiraToken = process.env.JIRA_API_TOKEN;
    const jiraEmail = process.env.JIRA_EMAIL || session.user.email;

    if (!jiraHost || !jiraToken || !jiraEmail) {
      return NextResponse.json({
        error: "Configuration Jira manquante"
      }, { status: 500 });
    }

    const basicAuth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

    // Créer la tâche dans Jira
    const response = await fetch(`${jiraHost}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          project: {
            key: projectKey
          },
          summary: summary,
          description: description,
          issuetype: {
            name: isSupport ? "Support" : "Task" // Adapter selon vos types de tâches
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur création tâche:", errorText);
      return NextResponse.json({
        error: "Erreur lors de la création de la tâche",
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      message: "Tâche créée avec succès",
      task: data
    });

  } catch (error) {
    console.error("Erreur complète:", error);
    return NextResponse.json({
      error: "Erreur lors de la création de la tâche",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
