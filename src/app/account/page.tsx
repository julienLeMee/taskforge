import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordChangeForm } from "@/components/settings/PasswordChangeForm";
// import { ThemeSelector } from '../components/ThemeSelector';
import { DeploymentToggle } from "./components/DeploymentToggle";
import { Separator } from "@/components/ui/separator";
export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container space-y-6 p-2 pt-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon compte</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Vos informations de profil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Nom</p>
              <p className="text-sm text-muted-foreground">{session.user?.name || "Non défini"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
            </div>

            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-medium">Préférences</p>
            </div>
            <div className="max-w-md">
                <DeploymentToggle />
            </div>


          </CardContent>
        </Card>

        <PasswordChangeForm />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}

        {/* <div className="max-w-md">
            <ThemeSelector />
        </div> */}
      {/* </div> */}

    </div>
  );
}
