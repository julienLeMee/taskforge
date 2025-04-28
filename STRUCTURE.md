# Structure du Projet TaskFlow

## Arborescence des fichiers

```
.
├── README.md
├── STRUCTURE.md
├── auth.ts
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   ├── migrations
│   │   ├── 20250419004352_init
│   │   │   └── migration.sql
│   │   ├── 20250419043245_init
│   │   │   └── migration.sql
│   │   ├── 20250419043343_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── scripts
│   └── update-password.ts
├── src
│   ├── app
│   │   ├── account
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   └── user
│   │   ├── auth
│   │   │   ├── signin
│   │   │   └── signup
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects
│   │   │   └── page.tsx
│   │   └── tasks
│   │       └── page.tsx
│   ├── components
│   │   ├── auth
│   │   │   └── SessionProvider.tsx
│   │   ├── dashboard
│   │   ├── layout
│   │   │   └── app-sidebar.tsx
│   │   ├── projects
│   │   ├── settings
│   │   │   └── PasswordChangeForm.tsx
│   │   ├── tasks
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── ui
│   │   │   ├── avatar.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── tooltip.tsx
│   │   └── user-nav.tsx
│   ├── hooks
│   │   └── use-mobile.ts
│   ├── lib
│   │   ├── auth
│   │   │   └── options.ts
│   │   ├── db
│   │   │   └── index.ts
│   │   ├── prisma.ts
│   │   ├── utils
│   │   │   └── index.ts
│   │   ├── utils.ts
│   │   └── validations
│   │       ├── index.ts
│   │       ├── project.ts
│   │       ├── task.ts
│   │       └── user.ts
│   └── types
└── tsconfig.json

35 directories, 57 files

```

## État d'avancement

### ✅ Structure de base
- [x] Projet Next.js configuré avec TypeScript
- [x] Configuration ESLint et PostCSS en place
- [x] Structure de dossiers standard Next.js

### ✅ Base de données
- [x] Prisma configuré comme ORM
- [x] Schéma de base de données défini

### 🚧 Frontend
- [x] Page principale et layout en place
- [x] Styles globaux configurés
- [ ] Interface utilisateur en développement

### 🚧 API
- [x] Structure API en place
- [ ] Routes à implémenter

## Stack Technologique

- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Base de données**: Prisma (ORM)
- **Styling**: Tailwind CSS
- **Linting**: ESLint
- **Package Manager**: npm/node

## Notes de développement

Le projet est une application web moderne avec une architecture bien structurée. Les fondations sont en place avec :
- Configuration complète de l'environnement de développement
- Structure modulaire pour une meilleure maintenabilité
- Intégration des outils modernes de développement
- Support pour le développement full-stack
