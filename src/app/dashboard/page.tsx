// src/app/dashboard/page.tsx
import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre tableau de bord personnel, {session.user?.name || "utilisateur"}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Carte statistique - Projets */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Projets actifs</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Vos projets en cours
          </p>
        </div>

        {/* Carte statistique - Tâches */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Tâches à accomplir</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Tâches en attente
          </p>
        </div>

        {/* Carte statistique - Échéances */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Prochaines échéances</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Échéances des 7 prochains jours
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2"></div>
    </div>
  );
}
