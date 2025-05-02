# Queer Cinema Database

**Queer Cinema Database** is a web platform for cataloging LGBT films from the 90s and 2000s, developed to provide a community-driven database. Users can search for films using advanced filters, view detailed movie pages, create accounts, and contribute by adding films or creating their own private movie lists.

## 🚀 Main Features

- **Homepage**: General overview of the site with thematic movies list.
- **Catalogue with Advanced Search**: View of all the movies with recents adding. Filter films by various criteria (genre, year, director, keyword, etc.).
- **Detailed Movie Pages**: Complete information (title, synopsis, director, etc.).
- **User Dashboard**:
  - Account creation and login.
  - Add films to the database.
  - Create personal movie lists (visible only to the user).
- **Community Database**: Open contributions to enrich the content.

## 🛠️ Technologies Used

- **Frontend Framework**: [Next.js](https://nextjs.org/)
- **Backend and ORM**: [Prisma ORM](https://www.prisma.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication and Storage**: [Supabase](https://supabase.io/)
- **Containerization**: [Docker](https://www.docker.com/)

## 📦 Installation and Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/movie-diary.git
   cd movie-diary
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env.local` file at the root of the project and add the required variables (example in `.env.example`).

4. Run the project with Docker:

   ```bash
   docker-compose up
   ```

5. Access the site:

   The project will be available at [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```plaintext
/root
├── /app                      # App router
│   ├── /about                # About page
│   ├── /api/contact          # Api for contact sending
│   ├── /auth/confirm
│   ├── /components           # Reusable Components
│   ├── /contact              # Contact Form page
│   ├── /error                # Error message page
│   ├── /lists                # Lists pages (list view, create and edit list pages)
│   ├── /login                # Login page and action
│   ├── /logout               # Logout action
│   ├── /movies               # Movies pages (catalogue, movie view, create and edit pages)
│   ├── /note                 # Note page
│   ├── /profile              # Profile user page
│   ├── /server-actions       # Get, add, edit, delete actions (movies and lists data)
│   ├── /signup               # Signup page and action
│   ├── /stats                # Statistics page
│   └── /types                # Types
├── /lib                      # prisma and supabase
├── /prisma                   # Prisma schema
├── /public                   # Public files (assets, etc.)
├── /supabase                 # Config for Docker
├── /tests                    # Playwright Tests
├── /utils                    # Utility functions
│   └── supabase              # Supabase (middleware, client, server)
├── docker-compose.yml        # Docker configuration
└── README.md                 # Documentation
```

## 🗃️ Database

The database schema is managed with **Drizzle ORM** and stored in **PostgreSQL**. Migrations are not yet automated and versioned. Below is an overview of the main tables:

- `users`: User management.
- `movies`: Film catalog.
- `lists`: User-created personal lists.

### 🌟 Note

This project is developed as part of the RNCP Application Developer certification program.

![CI](https://github.com/apolline-diaz/movie-diary/actions/workflows/ci.yml/badge.svg)
