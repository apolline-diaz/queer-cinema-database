# Queer Cinema Database

**Queer Cinema Database** is a web platform for cataloging LGBTQ+ films and series from past decades, highlighting espacially 90 and 2000s indie productions from around the world.

## 🚀 Main Features

- **About**: Presentation of the website approach.
- **Homepage**: General overview of the site with thematic movies list.
- **Catalogue with Advanced Search**: View of all the movies with recents adding. Filter films by various criteria (genre, year, director, keyword, etc.).
- **Detailed Movie Pages**: Complete information (title, synopsis, director, etc.).
- **User Account**:
  - Update password, name and create personal movie lists (visible only to the user).
  - Contribute to database by adding a movie (only admin).
- **Stats**: Display movies by keywords distribution.
- **Contact**: Contact form.

## 🛠️ Technologies Used

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Backend and ORM**: [Prisma ORM](https://www.prisma.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [Shadcn](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication and Storage**: [Supabase](https://supabase.io/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Unit Tests**: [Jest](https://nextjs.org/docs/app/guides/testing/jest)
- **End-to-end Tests**: [Playwright](https://nextjs.org/docs/pages/guides/testing/playwright)

## 🗃️ Database

The database schema is managed with **Prisma ORM** and stored in **PostgreSQL**. Migrations are not yet automated and versioned. Below is an overview of the main tables:

- `users`: User management.
- `movies`: Film catalog.
- `lists`: User-created personal lists.

## 📦 Installation and Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Supabase](https://supabase.com/)

### Clone the repository:

1. At first :

   ```bash
   git clone https://github.com/apolline-diaz/queer-cinema-database.git
   cd queer-cinema-database
   ```

### Local Development Setup with OrbStack + Supabase

To avoid incompatibility between mac and docker, use Orbstack (https://orbstack.dev).

1. Install OrbStack:

   ```bash
   brew install orbstack
   ```

   Start OrbStack:

   ```bash
   orbstack
   ```

2. Clone and Setup Project:

   Clone the repository :

   ```bash
   git clone [your-repo-url]
   cd [project-name]
   ```

   Install dependencies :

   ```bash
   npm install
   ```

   Copy environment file :

   ```bash
   cp .env.example .env.local
   ```

3. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

4. Initialize Supabase in project and start local Supabase stack

   ```bash
   supabase init
   ```

   ```bash
   supabase start
   ```

#### Note: This will download Docker images and start PostgreSQL, API, Auth, etc.

5. Configure Environment Variables

   Update .env.local with local Supabase URLs (displayed after supabase start).

6. Migrate Production Data to Local

   Link to your production project :

   ```bash
   supabase link --project-ref [your-project-id]
   ```

   Pull schema from production :

   ```bash
   supabase db pull
   ```

   Apply schema to local database :

   ```bash
   supabase db push
   ```

7. Get data from production to Local

   Dump data from production :

   ```bash
   supabase db dump --data-only -f data.sql
   ```

   Apply data on local base :

   ```bash
   psql "postgresql://postgres:postgres@localhost:54322/postgres" < data.sql
   ```

### Prisma Setup

1. Generate Prisma client

   ```bash
   npx prisma generate
   ```

2. Push schema to local database

   ```bash
   npx prisma db push
   ```

### Start Development Server

1. Start Next.js app

   ```bash
   npm run dev
   ```

### Access the site:

The project will be available at [http://localhost:3000](http://localhost:3000).

### Migrations with Prisma

1. Create a migration after modifying schema.prisma :

   ```bash
   npx prisma migrate dev --name init
   ```

1. First migration :

   ```bash
   npx prisma migrate dev --name added_movie_title_example
   ```

#### Direct SQL changes in Supabase

1. Synchronize schema from database :

   ```bash
   npx prisma db pull
   ```

2. Generate client with new schema :

   ```bash
   npx prisma generate
   ```

#### Production

1. Deploy migrations :

   ```bash
   npx prisma migrate deploy
   ```

### Tests Steps

1. Tests unitaires (Jest) :

   ```bash
   pnpm test
   ```

2. Tests end-to-end (Playwright) :

   ```bash
   pnpm exec playwright test
   ```

   To open UI mode :

   ```bash
   npx playwright test --ui
   ```

## 📂 Project Structure

```plaintext
├── app/                     # Application logic
│   ├── about/               # About page
│   ├── account/             # Account management
│   ├── api/                 # API routes
│   ├── auth/                # Authentication (login, signup)
│   ├── contact/             # Contact page
│   ├── error/               # Error pages
│   ├── lists/               # User's custom lists
│   ├── login/               # Login page
│   ├── logout/              # Logout logic
│   ├── movies/              # Movie listing and details
│   ├── server-actions/      # Server-side actions (CRUD for movies, lists, etc.)
│   ├── signup/              # Signup page
│   ├── stats/               # Statistics page
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
│
├── prisma/                  # Prisma schema and migrations
│   └── schema.prisma        # Database schema
│
├── public/                  # Public assets (images, favicons, etc.)
│
├── tests/                   # Tests
│   ├── e2e/                 # End-to-end tests
│   └── unit/                # Unit tests
│
├── lib/                     # Library functions
│   ├── prisma.ts            # Prisma client setup
│   └── supabase.ts          # Supabase client setup
│
├── coverage/                # Test coverage reports
│
├── .env.local               # Local environment variables
├── Dockerfile               # Docker configuration
├── docker-compose.yaml      # Docker Compose configuration
├── jest.config.ts           # Jest configuration for unit tests
├── playwright.config.ts     # Playwright configuration for e2e tests
├── README.md                # Documentation
├── tsconfig.json            # TypeScript configuration
└── next.config.mjs          # Next.js configuration
```

### 🌟 Note

This project is developed as part of the RNCP Application Developer certification program.

![CI](https://github.com/apolline-diaz/queer-cinema-database/actions/workflows/ci.yml/badge.svg)
