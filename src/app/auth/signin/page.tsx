"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Identifiants incorrects");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      setError("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-muted-foreground">
            Connectez-vous à votre compte TaskForge
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="exemple@email.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>
            Pas encore de compte ?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>

        {/* <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continuer avec
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            GitHub
          </Button>
        </div> */}
      </div>
    </div>
  );
}
