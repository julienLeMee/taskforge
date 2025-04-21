import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Projects() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Priorités</h1>
          <p className="text-muted-foreground">
            Gérez vos priorités et suivez leur progression
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center py-8">
          Aucune priorité pour le moment. Commencez par en créer une !
        </p>
      </div>
    </div>
  );
}
