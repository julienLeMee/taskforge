// src/app/dashboard/page.tsx
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function Dashboard() {
  const session = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre tableau de bord personnel, {session.user?.name || "utilisateur"}.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Carte statistique - Projets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Vos projets en cours
            </p>
          </CardContent>
        </Card>

        {/* Carte statistique - Tâches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches à accomplir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Tâches en attente
            </p>
          </CardContent>
        </Card>

        {/* Carte statistique - Échéances */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prochaines échéances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Échéances des 7 prochains jours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projets récents</CardTitle>
            <CardDescription>Vos derniers projets créés ou modifiés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucun projet récent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches à venir</CardTitle>
            <CardDescription>Vos prochaines tâches à réaliser</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Aucune tâche à venir</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
