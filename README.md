# 🎓 REC Digital Learning Ecosystem

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A comprehensive, modern Learning Management System built for REC — empowering students, instructors, and administrators with a seamless digital learning experience.

---

## 📖 About

The **REC Digital Learning Ecosystem** is a full-stack LMS platform that enables educational institutions to create, manage, and deliver online courses. It features role-based access control, course management, progress tracking, and a responsive, accessible user interface.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/UI    |
| **Backend**  | Node.js, Express.js, TypeScript                               |
| **Database** | PostgreSQL 14+, Prisma ORM                                    |
| **Auth**     | JWT (Access + Refresh tokens), bcrypt                         |
| **Shared**   | TypeScript types & constants (monorepo workspace)             |
| **DevOps**   | npm workspaces, concurrently, ESLint, Prettier                |

---

## 📁 Project Structure

```
rec-digital-learning-ecosystem/
├── client/                     # 🖥️  Next.js frontend
│   ├── public/                 #     Static assets
│   ├── src/
│   │   ├── app/                #     App Router pages & layouts
│   │   ├── components/         #     Reusable UI components
│   │   │   └── ui/             #     Shadcn/UI primitives
│   │   ├── hooks/              #     Custom React hooks
│   │   ├── lib/                #     Utilities, API client, helpers
│   │   ├── providers/          #     Context providers (auth, theme)
│   │   ├── services/           #     API service modules
│   │   └── types/              #     Client-specific types
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                     # ⚙️  Express.js backend
│   ├── prisma/
│   │   ├── schema.prisma       #     Database schema
│   │   └── seed.ts             #     Seed data
│   ├── src/
│   │   ├── config/             #     App & DB configuration
│   │   ├── controllers/        #     Route controllers
│   │   ├── middleware/          #     Auth, error, validation
│   │   ├── routes/             #     Express route definitions
│   │   ├── services/           #     Business logic layer
│   │   ├── utils/              #     Helpers & utilities
│   │   ├── validators/         #     Zod request validators
│   │   └── app.ts              #     Express app entry point
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                     # 🔗  Shared code (types & constants)
│   ├── types/
│   │   ├── index.ts            #     Core domain types
│   │   └── api.ts              #     API contract types
│   └── constants/
│       └── index.ts            #     Shared constants
│
├── .env.example                #     Environment variable template
├── .gitignore
├── package.json                #     Root workspace config
└── README.md                   #     📄 You are here
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

| Requirement      | Version  | Check Command            |
| ---------------- | -------- | ------------------------ |
| **Node.js**      | ≥ 18.17  | `node --version`         |
| **npm**          | ≥ 9.0    | `npm --version`          |
| **PostgreSQL**   | ≥ 14.0   | `psql --version`         |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/Digital-Learning-Ecosystem---REC-LMS.git
cd Digital-Learning-Ecosystem---REC-LMS
```

### 2. Install dependencies

```bash
npm install
```

> This installs dependencies for the root, `client/`, and `server/` workspaces automatically via npm workspaces.

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and update the values — at minimum:

- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — unique random strings

### 4. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start development servers

```bash
npm run dev
```

This launches both servers concurrently:

| Service    | URL                        |
| ---------- | -------------------------- |
| 🖥️ Client | http://localhost:3000       |
| ⚙️ Server  | http://localhost:5000       |
| 📡 API     | http://localhost:5000/api/v1|

---

## 📜 Available Scripts

Run these from the **project root**:

| Script             | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run dev`      | Start both client & server in development mode   |
| `npm run dev:client` | Start only the Next.js client                  |
| `npm run dev:server` | Start only the Express server                  |
| `npm run build`    | Build both client & server for production        |
| `npm run db:generate` | Generate Prisma client                        |
| `npm run db:push`  | Push Prisma schema to the database               |
| `npm run db:migrate` | Run Prisma migrations                          |
| `npm run db:seed`  | Seed the database with sample data               |
| `npm run db:studio` | Open Prisma Studio (visual DB browser)          |
| `npm run lint`     | Lint both client & server                        |
| `npm run typecheck` | Run TypeScript type checking                    |
| `npm run clean`    | Remove all build artifacts & `node_modules`      |

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint                 | Description              | Access    |
| ------ | ------------------------ | ------------------------ | --------- |
| POST   | `/api/v1/auth/register`  | Register a new user      | Public    |
| POST   | `/api/v1/auth/login`     | Login & receive tokens   | Public    |
| POST   | `/api/v1/auth/refresh`   | Refresh access token     | Public    |
| GET    | `/api/v1/auth/me`        | Get current user profile | Protected |

### Courses

| Method | Endpoint                          | Description              | Access      |
| ------ | --------------------------------- | ------------------------ | ----------- |
| GET    | `/api/v1/courses`                 | List published courses   | Public      |
| GET    | `/api/v1/courses/:slug`           | Get course details       | Public      |
| POST   | `/api/v1/courses`                 | Create a new course      | Instructor  |
| PATCH  | `/api/v1/courses/:id`             | Update a course          | Instructor  |
| DELETE | `/api/v1/courses/:id`             | Delete a course          | Instructor  |
| POST   | `/api/v1/courses/:id/publish`     | Publish a course         | Instructor  |

### Chapters

| Method | Endpoint                                        | Description            | Access      |
| ------ | ----------------------------------------------- | ---------------------- | ----------- |
| GET    | `/api/v1/courses/:courseId/chapters`             | List chapters          | Enrolled    |
| POST   | `/api/v1/courses/:courseId/chapters`             | Create a chapter       | Instructor  |
| PATCH  | `/api/v1/courses/:courseId/chapters/:id`         | Update a chapter       | Instructor  |
| PUT    | `/api/v1/courses/:courseId/chapters/reorder`     | Reorder chapters       | Instructor  |

### Enrollments & Progress

| Method | Endpoint                                        | Description            | Access      |
| ------ | ----------------------------------------------- | ---------------------- | ----------- |
| POST   | `/api/v1/courses/:courseId/enroll`               | Enroll in a course     | Student     |
| PUT    | `/api/v1/chapters/:chapterId/progress`           | Update chapter progress| Student     |

### Categories

| Method | Endpoint              | Description           | Access  |
| ------ | --------------------- | --------------------- | ------- |
| GET    | `/api/v1/categories`  | List all categories   | Public  |
| POST   | `/api/v1/categories`  | Create a category     | Admin   |

---

## 🏗️ Project Architecture

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Client     │◄─────►│   Server    │◄─────►│  Database   │
│  (Next.js)   │  API  │  (Express)  │ Prisma│ (PostgreSQL)│
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │
       └──────────┬──────────┘
                  │
          ┌───────▼───────┐
          │    Shared      │
          │ Types/Constants│
          └───────────────┘
```

### Layers

| Layer            | Responsibility                                                |
| ---------------- | ------------------------------------------------------------- |
| **Routes**       | Define HTTP endpoints and attach middleware                   |
| **Controllers**  | Parse requests, call services, send responses                 |
| **Services**     | Business logic, data transformation, orchestration            |
| **Validators**   | Request validation with Zod schemas                           |
| **Middleware**    | Authentication, authorization, error handling                 |
| **Prisma/Models**| Database access via Prisma ORM                                |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style (formatting, semicolons, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for <strong>REC</strong> — Empowering Digital Learning
</p>
