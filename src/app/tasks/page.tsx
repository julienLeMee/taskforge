import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function Tasks() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tâches</h1>
          <p className="text-muted-foreground">
            Gérez vos tâches et suivez leur avancement
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-muted-foreground text-center py-8">
          Aucune tâche pour le moment. Commencez par en créer une !
        </p>
      </div>
    </div>
  );
}
