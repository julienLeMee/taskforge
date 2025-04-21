import { NextResponse } from "next/server";
import { auth as getAuth } from "@/../../auth";

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
          hasEmail: !!jiraEmail,
          email: jiraEmail
        }
      }, { status: 500 });
    }

    // Utiliser l'authentification Basic avec email:token
    const basicAuth = Buffer.from(`${jiraEmail}:${jiraToken}`).toString('base64');

    console.log("Tentative de connexion avec:", {
      host: jiraHost,
      email: jiraEmail,
      authType: 'Basic'
    });

    const response = await fetch(`${jiraHost}/rest/api/3/myself`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      return NextResponse.json({
        error: "Erreur lors de la connexion à Jira",
        details: {
          message: errorText,
          status: response.status,
          email: jiraEmail
        }
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({
      message: "Connexion réussie",
      data
    });
  } catch (error) {
    console.error("Erreur complète:", error);
    return NextResponse.json({
      error: "Erreur lors de la connexion à Jira",
      details: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
