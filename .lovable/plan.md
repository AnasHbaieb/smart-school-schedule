

# SmartTimetable — School Timetable Management System

## Overview
A timetable management app where admins create conflict-free schedules, and teachers/students view their personalized timetables. Built with React + Tailwind + Supabase.

## Database Schema (Supabase)

### Tables
- **profiles** — user_id, full_name, role (admin/teacher/student), linked to auth.users
- **user_roles** — user_id, role (enum: admin, teacher, student)
- **teachers** — id, user_id (optional link to auth), name, subject_id
- **teacher_availability** — teacher_id, day_of_week, start_time, end_time
- **classrooms** — id, name, capacity
- **subjects** — id, title, weekly_hours, color (for UI)
- **student_groups** — id, grade, section
- **lesson_slots** — id, day_of_week (Mon–Sat), start_time, end_time
- **timetable_entries** — id, lesson_slot_id, teacher_id, classroom_id, subject_id, student_group_id (unique constraints to prevent conflicts)

### Conflict Prevention
- Unique constraint on (lesson_slot_id, teacher_id) — teacher can't be double-booked
- Unique constraint on (lesson_slot_id, classroom_id) — classroom can't be double-booked
- Unique constraint on (lesson_slot_id, student_group_id) — group can't have two lessons at once

## Pages & UI

### 1. Auth Pages
- Login/Signup with role-based redirect
- Password reset flow

### 2. Admin Dashboard
- **Weekly Calendar View** — rows = time slots, columns = days (Mon–Sat)
- Filter by student group, teacher, or classroom
- Color-coded subjects
- Drag & drop to assign/move lessons
- Conflict warnings (red highlights if a slot violates constraints)
- CRUD panels for: Teachers, Classrooms, Subjects, Student Groups, Time Slots

### 3. Teacher View
- Personal weekly schedule (read-only)
- Shows classroom and student group for each lesson

### 4. Student View
- Group schedule (read-only, filtered by their grade/section)
- Mobile-optimized card layout

### 5. Global Features
- Dark mode toggle
- Responsive/mobile-friendly design
- Toast notifications for save/error states

## Scheduling Algorithm (Client-side helper)
- Auto-assign function that distributes subjects across the weekly grid
- Validates: no teacher/classroom/group conflicts per slot
- Minimizes gaps for student groups using a greedy slot-filling approach
- Admin can override with manual drag & drop

## Implementation Order
1. Supabase tables, RLS policies, and auth setup
2. Auth pages (login/signup) with role-based routing
3. Admin dashboard with weekly calendar grid and CRUD management
4. Drag & drop lesson assignment with conflict validation
5. Auto-scheduling algorithm
6. Teacher and Student read-only views
7. Dark mode and mobile responsiveness polish

