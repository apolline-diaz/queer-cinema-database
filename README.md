# Queer Cinema Database

**Queer Cinema Database** is a web platform for cataloging LGBTQ+ films and series from past decades, highlighting espacially 90 and 2000s indie productions from around the world.

## 🚀 Main Features

- **About**: Presentation of the website approach.
- **Homepage**: General overview of the site with thematic movies list.
- **Catalogue with Advanced Search**: View of all the movies with recents adding. Filter films by various criteria (genre, year, director, keyword, etc.).
- **Detailed Movie Pages**: Complete information (title, synopsis, director, etc.).
- **User Profile**:
  - Create personal movie lists (visible only to the user).
- **Stats**: Display movies by keywords distribution.
- **Contact**: Contact form.

## 🛠️ Technologies Used

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Backend and ORM**: [Prisma ORM](https://www.prisma.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication and Storage**: [Supabase](https://supabase.io/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Unit Tests**: [Jest](https://nextjs.org/docs/app/guides/testing/jest)
- **End-to-end Tests**: [Playwright](https://nextjs.org/docs/pages/guides/testing/playwright)

## 📦 Installation and Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/apolline-diaz/queer-cinema-database.git
   cd queer-cinema-database
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env.local` file at the root of the project and add the required variables.

4. Run the project with Docker:

   ```bash
   docker-compose up
   ```

5. Access the site:

   The project will be available at [http://localhost:3000](http://localhost:3000).

### Tests Steps

1. Tests unitaires (Jest) :

   ```bash
   pnpm test
   ```

2. Tests end-to-end (Playwright) :

   ```bash
   pnpm exec playwright test
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
│   ├── note/                # Notes or movie reviews
│   ├── profile/             # User profile page
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

## 🗃️ Database

The database schema is managed with **Prisma ORM** and stored in **PostgreSQL**. Migrations are not yet automated and versioned. Below is an overview of the main tables:

- `users`: User management.
- `movies`: Film catalog.
- `lists`: User-created personal lists.

### 🌟 Note

This project is developed as part of the RNCP Application Developer certification program.

![CI](https://github.com/apolline-diaz/queer-cinema-database/actions/workflows/ci.yml/badge.svg)
