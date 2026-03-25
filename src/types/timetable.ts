export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT: Record<DayOfWeek, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat',
};

export interface Teacher {
  id: string;
  name: string;
  subject_id: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
}

export interface Subject {
  id: string;
  title: string;
  weekly_hours: number;
  color: string;
}

export interface StudentGroup {
  id: string;
  grade: string;
  section: string;
}

export interface LessonSlot {
  id: string;
  day_of_week: DayOfWeek;
  start_time: string; // HH:mm
  end_time: string;
}

export interface TimetableEntry {
  id: string;
  lesson_slot_id: string;
  teacher_id: string;
  classroom_id: string;
  subject_id: string;
  student_group_id: string;
}

// Subject color map for UI
export const SUBJECT_COLORS: Record<string, string> = {
  math: 'bg-[hsl(243,75%,59%)]',
  science: 'bg-[hsl(167,72%,42%)]',
  english: 'bg-[hsl(25,95%,53%)]',
  history: 'bg-[hsl(340,65%,55%)]',
  art: 'bg-[hsl(280,65%,60%)]',
  pe: 'bg-[hsl(200,80%,50%)]',
};
