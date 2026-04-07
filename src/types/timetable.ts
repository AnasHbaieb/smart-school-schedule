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
  hours_per_week: number;
  sections: string[]; // e.g. ['10A', '11B'] - multiple grade/sections
}

export interface Classroom {
  id: string;
  name: string;
  is_general: boolean;
  subject_ids: string[]; // UUID[] for specialized, empty for general
}

export interface Subject {
  id: string;
  title: string;
  color: string;
}

export interface StudentGroup {
  id: string;
  grade: string;
  section: string;
  class_name: string;
  subjects: { subject_id: string; hours_per_week: number }[];
}

export interface TimeSlotDef {
  id: string;
  start_time: string;
  end_time: string;
  days: DayOfWeek[];
  is_lunch_break: boolean;
}

export interface LessonSlot {
  id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  time_slot_id: string;
}

export interface TimetableEntry {
  id: string;
  time_slot_id: string;
  day_of_week: DayOfWeek;
  teacher_id: string;
  classroom_id: string;
  subject_id: string;
  student_group_id: string;
}
