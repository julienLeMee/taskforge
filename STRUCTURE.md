# Structure du Projet TaskForge

## Arborescence des fichiers

```
TaskForge/
├── 📁 src/                      # Code source principal
│   ├── 📁 app/                  # Application Next.js
│   │   ├── 📄 page.tsx         # Page principale
│   │   ├── 📄 layout.tsx       # Layout principal
│   │   ├── 📄 globals.css      # Styles globaux
│   │   └── 📁 api/             # Routes API
│   └── 📁 lib/                 # Utilitaires et fonctions partagées
│
├── 📁 prisma/                   # Configuration base de données
│   └── 📄 schema.prisma        # Schéma de la base de données
│
├── 📁 public/                   # Assets statiques
├── 📁 .next/                    # Build Next.js (généré)
├── 📁 node_modules/            # Dépendances (généré)
├── 📄 .env                      # Variables d'environnement
├── 📄 package.json             # Dépendances et scripts
├── 📄 package-lock.json        # Versions exactes des dépendances
├── 📄 tsconfig.json            # Configuration TypeScript
├── 📄 next.config.ts           # Configuration Next.js
├── 📄 postcss.config.mjs       # Configuration PostCSS
├── 📄 eslint.config.mjs        # Configuration ESLint
├── 📄 components.json          # Configuration des composants
└── 📄 .gitignore              # Fichiers ignorés par Git

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
