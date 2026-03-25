# SmartTimetable 🗓️

An intelligent school timetable management system built with React, TypeScript, and Tailwind CSS. SmartTimetable simplifies the process of organizing weekly schedules for teachers, classrooms, and student groups — ensuring conflict-free planning across your entire institution.

## ✨ Features

- **Dashboard** — At-a-glance overview of teachers, classrooms, student groups, and scheduled lessons with conflict detection.
- **Timetable View** — Interactive weekly grid (Monday–Saturday) displaying all lessons by time slot, filterable by student group.
- **Teacher Management** — Add, edit, and remove teachers with subject assignments, weekly teaching hours, and section allocation.
- **Classroom Management** — Manage regular and specialized rooms; assign specific subjects or mark as general-purpose ("all").
- **Subject Management** — Define subjects with color coding and weekly hour allocations.
- **Student Groups** — Organize students by grade and section, each with a tailored list of subjects and per-subject weekly hours.
- **Lesson Slots** — Configure the daily time-slot grid that underpins the timetable.
- **Dark / Light Mode** — Full theme support with a single toggle.
- **Responsive Design** — Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React 18 + TypeScript               |
| Styling      | Tailwind CSS + shadcn/ui            |
| Routing      | React Router v6                     |
| State        | React Query (TanStack Query)        |
| Backend      | Supabase (Auth, Database, Storage)  |
| Build Tool   | Vite                                |
| Testing      | Vitest + Playwright                 |

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/smart-timetable.git
cd smart-timetable

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file in the project root (auto-generated when using Lovable Cloud):

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/        # AppLayout, Sidebar, MobileHeader
│   ├── timetable/     # WeeklyGrid and related components
│   └── ui/            # Reusable shadcn/ui components
├── data/              # Mock data for development
├── hooks/             # Custom React hooks (theme, mobile, toast)
├── integrations/      # Supabase client & types
├── pages/             # Route-level page components
├── types/             # TypeScript type definitions
└── lib/               # Utility functions
```

## 📖 Usage

1. **Set up subjects** — Define the subjects your school offers along with their weekly hours.
2. **Add teachers** — Register teaching staff, assign their subject and section.
3. **Configure classrooms** — Add rooms and specify whether they are general-purpose or subject-specific.
4. **Create student groups** — Define grade/section combinations and assign subjects with hours.
5. **Build the timetable** — Use the weekly grid to schedule lessons across available slots.

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npx playwright test
```
