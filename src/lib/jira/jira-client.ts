const JIRA_HOST = process.env.JIRA_HOST;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;

// Vérifier que les variables d'environnement sont définies
if (!JIRA_HOST || !JIRA_API_TOKEN || !JIRA_USER_EMAIL) {
  console.warn('Variables d\'environnement Jira manquantes. L\'intégration Jira ne fonctionnera pas.');
}

// Fonction de base pour faire des requêtes à l'API Jira
async function fetchJira(endpoint: string, options: RequestInit = {}) {
  if (!JIRA_HOST || !JIRA_API_TOKEN || !JIRA_USER_EMAIL) {
    throw new Error('Configuration Jira incomplète');
  }

  const url = `${JIRA_HOST}${endpoint}`;

  // Créer les en-têtes d'authentification (Basic Auth avec email:token)
  const authString = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

  const headers = {
    'Authorization': `Basic ${authString}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.errorMessages?.join(', ') ||
        `Erreur Jira: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Jira:', error);
    throw error;
  }
}

// Types pour les réponses Jira
export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
      statusCategory: {
        name: string;
        colorName: string;
      }
    };
    priority?: {
      name: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    created: string;
    updated: string;
    duedate?: string;
  }
}

// Fonctions pour interagir avec l'API Jira
export const jiraClient = {
  // Récupérer les tickets assignés à l'utilisateur
  getMyIssues: async (): Promise<JiraIssue[]> => {
    // JQL pour trouver les tickets assignés à l'utilisateur
    const jql = `assignee = currentUser() ORDER BY updated DESC`;
    const data = await fetchJira(`/rest/api/3/search?jql=${encodeURIComponent(jql)}`);
    return data.issues;
  },

  // Récupérer un ticket spécifique par sa clé (ex: PRJ-123)
  getIssue: async (issueKey: string): Promise<JiraIssue> => {
    return await fetchJira(`/rest/api/3/issue/${issueKey}`);
  },

  // Rechercher des tickets avec JQL (Jira Query Language)
  searchIssues: async (jql: string): Promise<JiraIssue[]> => {
    const data = await fetchJira(`/rest/api/3/search?jql=${encodeURIComponent(jql)}`);
    return data.issues;
  }
};
