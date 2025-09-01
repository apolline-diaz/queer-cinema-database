# Queer Cinema Database

**Queer Cinema Database** is a web platform for cataloging LGBTQ+ films and series from past decades, highlighting espacially 90 and 2000s indie productions from around the world.

## 🚀 Main Features

- **About**: Presentation of the website approach.
- **Homepage**: General overview of the site with thematic movies list.
- **Films with Advanced Search**: View of all the movies with recents adding. Filter films by various criteria (genre, year, director, keyword, etc.).
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

## 📦 Installation and Setup

### Quick Start with Docker

This is the easiest way to get the application running locally without complex setup.

#### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

#### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/apolline-diaz/queer-cinema-database.git
   cd queer-cinema-database
   ```

2. Create environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Start the application with Docker Compose:

   ```bash
   docker-compose up -d
   ```

This command will:

- Start a PostgreSQL database
- Start the Supabase local stack (Auth, API, Storage)
- Build and run the Next.js application

4. Wait for services to be ready:

   ```bash
   docker-compose ps
   ```

5. Initialize the database:

   ```bash
   docker-compose exec app npx prisma migrate dev --name init
   ```

   ```bash
   docker-compose exec app npx prisma generate
   ```

6. Access the application:

   Main App: http://localhost:3000

### Local Development Setup (Advanced)

For developers who want to work on the project locally without Docker.

#### Prerequisites

- [Node.js] (https://nodejs.org/fr)
- [pnpm](https://pnpm.io/)
- [Supabase CLI](https://supabase.com/docs/guides/local-development)

MacOS Setup with OrbStack
To avoid Docker compatibility issues on macOS, use OrbStack:

1. Install OrbStack:

   ```bash
   brew install orbstack
   orbstack
   ```

2. Setup Project:

   ```bash
   git clone https://github.com/apolline-diaz/queer-cinema-database.git
   cd queer-cinema-database
   pnpm install
   cp .env.example .env.local
   ```

3. Initialize Supabase:

   ```bash
   supabase init
   supabase start
   ```

4. Configure Environment Variables

   Update .env.local with local Supabase URLs (displayed after supabase start).

5. Setup Database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. Start Development Server:

   ```bash
   pnpm dev
   ```

### Prisma Migrations

1. Create and apply migration :

   ```bash
   npx prisma migrate dev --name migration_name
   ```

2. For production :

   ```bash
   npx prisma migrate deploy
   ```

3. Synchronize schema from database :

   ```bash
   npx prisma db pull
   ```

4. Generate client with new schema :

   ```bash
   npx prisma generate
   ```

### Testing

1. Tests unitaires (Jest) :

   ```bash
   pnpm test
   ```

2. Tests end-to-end (Playwright) :

   Local development :

   ```bash
   pnpm exec playwright test
   ```

   Open UI mode :

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
