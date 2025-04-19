import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Projects() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
          <p className="text-muted-foreground">
            Gérez vos projets et suivez leur progression
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center py-8">
          Aucun projet pour le moment. Commencez par en créer un !
        </p>
      </div>
    </div>
  );
}
