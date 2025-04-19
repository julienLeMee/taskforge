// src/lib/auth/options.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          try {
            // Trouver l'utilisateur par email
            const user = await prisma.user.findUnique({
              where: { email: credentials.email as string },
            });

            // Si l'utilisateur n'existe pas ou n'a pas de mot de passe (utilisateur OAuth)
            if (!user || !user.password) {
              return null;
            }

            // Vérifier le mot de passe
            const passwordMatch = await bcrypt.compare(
              credentials.password as string,
              user.password
            );

            if (!passwordMatch) {
              return null;
            }

            // Retourner l'utilisateur sans le mot de passe
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          } catch (error) {
            console.error("Erreur d'authentification:", error);
            return null;
          }
        }
      }),
    // Vous pouvez activer ces providers quand vous aurez les clés API
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
