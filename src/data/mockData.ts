import { Teacher, Classroom, Subject, StudentGroup, LessonSlot, TimetableEntry, DayOfWeek } from '@/types/timetable';

export const mockSubjects: Subject[] = [
  { id: 's1', title: 'Mathematics', weekly_hours: 5, color: 'hsl(243 75% 59%)' },
  { id: 's2', title: 'Science', weekly_hours: 4, color: 'hsl(167 72% 42%)' },
  { id: 's3', title: 'English', weekly_hours: 5, color: 'hsl(25 95% 53%)' },
  { id: 's4', title: 'History', weekly_hours: 3, color: 'hsl(340 65% 55%)' },
  { id: 's5', title: 'Art', weekly_hours: 2, color: 'hsl(280 65% 60%)' },
  { id: 's6', title: 'Physical Ed', weekly_hours: 2, color: 'hsl(200 80% 50%)' },
];

export const mockTeachers: Teacher[] = [
  { id: 't1', name: 'Dr. Ahmed', subject_id: 's1', hours_per_week: 18, section: 'A' },
  { id: 't2', name: 'Ms. Sarah', subject_id: 's2', hours_per_week: 16, section: 'A' },
  { id: 't3', name: 'Mr. James', subject_id: 's3', hours_per_week: 20, section: 'B' },
  { id: 't4', name: 'Mrs. Fatima', subject_id: 's4', hours_per_week: 12, section: 'A' },
  { id: 't5', name: 'Mr. Omar', subject_id: 's5', hours_per_week: 8, section: 'B' },
  { id: 't6', name: 'Coach Khalid', subject_id: 's6', hours_per_week: 10, section: 'A' },
];

export const mockClassrooms: Classroom[] = [
  { id: 'c1', name: 'Room 101', subject_ids: ['all'] },
  { id: 'c2', name: 'Room 102', subject_ids: ['all'] },
  { id: 'c3', name: 'Lab A', subject_ids: ['s2'] },
  { id: 'c4', name: 'Lab B', subject_ids: ['s2'] },
  { id: 'c5', name: 'Art Studio', subject_ids: ['s5'] },
  { id: 'c6', name: 'Gym', subject_ids: ['s6'] },
];

export const mockStudentGroups: StudentGroup[] = [
  { id: 'g1', grade: '10', section: 'A', subjects: [
    { subject_id: 's1', hours_per_week: 5 }, { subject_id: 's2', hours_per_week: 4 },
    { subject_id: 's3', hours_per_week: 5 }, { subject_id: 's4', hours_per_week: 3 },
    { subject_id: 's5', hours_per_week: 2 }, { subject_id: 's6', hours_per_week: 2 },
  ]},
  { id: 'g2', grade: '10', section: 'B', subjects: [
    { subject_id: 's1', hours_per_week: 5 }, { subject_id: 's3', hours_per_week: 5 },
    { subject_id: 's2', hours_per_week: 4 }, { subject_id: 's6', hours_per_week: 2 },
  ]},
  { id: 'g3', grade: '11', section: 'A', subjects: [
    { subject_id: 's1', hours_per_week: 4 }, { subject_id: 's2', hours_per_week: 4 },
    { subject_id: 's3', hours_per_week: 4 }, { subject_id: 's4', hours_per_week: 3 },
  ]},
  { id: 'g4', grade: '11', section: 'B', subjects: [
    { subject_id: 's1', hours_per_week: 4 }, { subject_id: 's3', hours_per_week: 4 },
    { subject_id: 's5', hours_per_week: 3 }, { subject_id: 's6', hours_per_week: 3 },
  ]},
];

const timeSlots = [
  { start: '08:00', end: '08:45' },
  { start: '08:50', end: '09:35' },
  { start: '09:45', end: '10:30' },
  { start: '10:35', end: '11:20' },
  { start: '11:30', end: '12:15' },
  { start: '12:20', end: '13:05' },
  { start: '14:00', end: '14:45' },
  { start: '14:50', end: '15:35' },
];

const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const mockLessonSlots: LessonSlot[] = [];
let slotId = 1;
for (const day of days) {
  for (const ts of timeSlots) {
    mockLessonSlots.push({
      id: `ls${slotId++}`,
      day_of_week: day,
      start_time: ts.start,
      end_time: ts.end,
    });
  }
}

// Sample timetable entries for grade 10A
export const mockTimetableEntries: TimetableEntry[] = [
  { id: 'te1', lesson_slot_id: 'ls1', teacher_id: 't1', classroom_id: 'c1', subject_id: 's1', student_group_id: 'g1' },
  { id: 'te2', lesson_slot_id: 'ls2', teacher_id: 't2', classroom_id: 'c3', subject_id: 's2', student_group_id: 'g1' },
  { id: 'te3', lesson_slot_id: 'ls3', teacher_id: 't3', classroom_id: 'c1', subject_id: 's3', student_group_id: 'g1' },
  { id: 'te4', lesson_slot_id: 'ls5', teacher_id: 't4', classroom_id: 'c2', subject_id: 's4', student_group_id: 'g1' },
  { id: 'te5', lesson_slot_id: 'ls6', teacher_id: 't5', classroom_id: 'c5', subject_id: 's5', student_group_id: 'g1' },
  // Tuesday
  { id: 'te6', lesson_slot_id: 'ls9', teacher_id: 't1', classroom_id: 'c1', subject_id: 's1', student_group_id: 'g1' },
  { id: 'te7', lesson_slot_id: 'ls10', teacher_id: 't3', classroom_id: 'c2', subject_id: 's3', student_group_id: 'g1' },
  { id: 'te8', lesson_slot_id: 'ls11', teacher_id: 't6', classroom_id: 'c6', subject_id: 's6', student_group_id: 'g1' },
  { id: 'te9', lesson_slot_id: 'ls13', teacher_id: 't2', classroom_id: 'c3', subject_id: 's2', student_group_id: 'g1' },
  // Wednesday
  { id: 'te10', lesson_slot_id: 'ls17', teacher_id: 't3', classroom_id: 'c1', subject_id: 's3', student_group_id: 'g1' },
  { id: 'te11', lesson_slot_id: 'ls18', teacher_id: 't1', classroom_id: 'c1', subject_id: 's1', student_group_id: 'g1' },
  { id: 'te12', lesson_slot_id: 'ls19', teacher_id: 't4', classroom_id: 'c2', subject_id: 's4', student_group_id: 'g1' },
  { id: 'te13', lesson_slot_id: 'ls21', teacher_id: 't2', classroom_id: 'c3', subject_id: 's2', student_group_id: 'g1' },
];

export function getSubjectById(id: string) {
  return mockSubjects.find(s => s.id === id);
}
export function getTeacherById(id: string) {
  return mockTeachers.find(t => t.id === id);
}
export function getClassroomById(id: string) {
  return mockClassrooms.find(c => c.id === id);
}
