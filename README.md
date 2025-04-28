# TaskFlow

TaskFlow est une application full stack de gestion de projets personnels permettant à l'utilisateur de gérer efficacement ses projets et tâches. Ce projet a été conçu pour se perfectionner dans le développement full stack moderne.

## 🚀 Fonctionnalités

- **Authentification complète** (locale, Google, GitHub)
- **Gestion de projets** (création, modification, suppression)
- **Suivi des tâches** (Kanban, priorités, échéances)
- **Tableau de bord personnalisé** avec statistiques et graphiques
- **Interface responsive** avec mode clair/sombre
- **Collaboration** entre utilisateurs (partage de projets)

## 🔧 Stack Technologique

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) avec App Router
- **Langage**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn UI](https://ui.shadcn.com/)
- **Validation de formulaires**: [Zod](https://zod.dev/)

### Backend
- **API Routes**: Next.js API Routes avec TypeScript
- **Base de données**: PostgreSQL via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentification**: [NextAuth.js](https://next-auth.js.org/)

### Déploiement
- **Hébergement**: [Vercel](https://vercel.com/)
- **Base de données**: [Supabase](https://supabase.com/)

## 📁 Structure du Projet

```
taskforge/
├── src/                     # Code source principal
│   ├── app/                 # Pages et routes (Next.js App Router)
│   │   ├── api/            # Routes API
│   │   ├── auth/           # Pages d'authentification
│   │   ├── dashboard/      # Pages du tableau de bord
│   │   ├── projects/       # Pages des projets
│   │   └── tasks/          # Pages des tâches
│   │
│   ├── components/          # Composants React
│   │   ├── auth/           # Composants d'authentification
│   │   ├── dashboard/      # Composants du tableau de bord
│   │   ├── layout/         # Layouts et composants structurels
│   │   ├── projects/       # Composants liés aux projets
│   │   ├── tasks/          # Composants liés aux tâches
│   │   └── ui/             # Composants UI réutilisables
│   │
│   ├── hooks/               # Hooks React personnalisés
│   │
│   ├── lib/                 # Utilitaires et fonctions
│   │   ├── auth/           # Configuration de l'authentification
│   │   ├── db/             # Utilitaires de base de données
│   │   ├── utils/          # Fonctions utilitaires générales
│   │   └── validations/    # Schémas de validation Zod
│   │
│   └── types/               # Types TypeScript globaux
│
├── prisma/                  # Configuration Prisma
│   ├── migrations/         # Migrations de base de données
│   └── schema.prisma       # Schéma de la base de données
│
├── public/                  # Fichiers statiques
├── .env                     # Variables d'environnement
├── next.config.js          # Configuration Next.js
└── tailwind.config.ts      # Configuration Tailwind CSS
```

## 📝 Modèles de Données

### User (Utilisateur)
Stocke les informations des utilisateurs et gère l'authentification.

### Project (Projet)
Représente les projets créés par les utilisateurs avec titre, description, dates, etc.

### Task (Tâche)
Représente les tâches individuelles au sein d'un projet avec titre, description, statut, priorité, échéance, etc.

## 🔍 Fonctionnalités Principales et Endpoints API

### Authentification
- `/api/auth/*` - Routes NextAuth.js pour l'authentification
- Support pour l'authentification par email/mot de passe, Google et GitHub

### Projets
- `/api/projects` - CRUD pour les projets
- Filtrage, tri et recherche de projets

### Tâches
- `/api/tasks` - CRUD pour les tâches
- Gestion des statuts, priorités et échéances
- Organisation en Kanban

## 🚦 Installation et Démarrage

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-username/taskforge.git
   cd taskforge
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` basé sur `.env.example` et configurez vos variables d'environnement:
   ```
   DATABASE_URL=votre_url_supabase
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=votre_secret
   ```

4. **Générer le client Prisma**
   ```bash
   npx prisma generate
   ```

5. **Lancer l'application en développement**
   ```bash
   npm run dev
   ```

## 📈 Plan de Développement

Le développement suit un plan en 4 phases:

1. **Phase 1**: Configuration et base du projet
2. **Phase 2**: Fonctionnalités principales (authentification, projets, tâches)
3. **Phase 3**: Fonctionnalités avancées (visualisation, collaboration)
4. **Phase 4**: Finalisation et déploiement

Chaque phase est divisée en sprints d'une semaine avec des user stories spécifiques.

## 🤝 Contribution

TaskFlow est un projet personnel de développement de compétences. Les conseils et suggestions sont les bienvenus!

## 📄 Licence

Ce projet est sous licence MIT.
