import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="container flex flex-col items-center justify-center gap-8 px-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-center sm:text-[5rem]">
          Task<span className="text-primary">Forge</span>
        </h1>
        <p className="lg:text-xl sm:text-base text-center max-w-2xl text-muted-foreground">
          Organisez efficacement vos projets.
        </p>
        {/* TODO: Add a login button and a signup button */}
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button>Login</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline">Signup</Button>
          </Link>
          </div>
        </div>
      </main>
    );
  }
}
