import { useState, useCallback } from 'react';
import { Teacher, Classroom, Subject, StudentGroup, LessonSlot, TimetableEntry, DayOfWeek } from '@/types/timetable';

const defaultSubjects: Subject[] = [
  { id: 's1', title: 'Mathematics', weekly_hours: 5, color: 'hsl(243 75% 59%)' },
  { id: 's2', title: 'Science', weekly_hours: 4, color: 'hsl(167 72% 42%)' },
  { id: 's3', title: 'English', weekly_hours: 5, color: 'hsl(25 95% 53%)' },
  { id: 's4', title: 'History', weekly_hours: 3, color: 'hsl(340 65% 55%)' },
  { id: 's5', title: 'Art', weekly_hours: 2, color: 'hsl(280 65% 60%)' },
  { id: 's6', title: 'Physical Ed', weekly_hours: 2, color: 'hsl(200 80% 50%)' },
];

const defaultTeachers: Teacher[] = [
  { id: 't1', name: 'Dr. Ahmed', subject_id: 's1', hours_per_week: 18, section: 'A' },
  { id: 't2', name: 'Ms. Sarah', subject_id: 's2', hours_per_week: 16, section: 'A' },
  { id: 't3', name: 'Mr. James', subject_id: 's3', hours_per_week: 20, section: 'B' },
  { id: 't4', name: 'Mrs. Fatima', subject_id: 's4', hours_per_week: 12, section: 'A' },
  { id: 't5', name: 'Mr. Omar', subject_id: 's5', hours_per_week: 8, section: 'B' },
  { id: 't6', name: 'Coach Khalid', subject_id: 's6', hours_per_week: 10, section: 'A' },
];

const defaultClassrooms: Classroom[] = [
  { id: 'c1', name: 'Room 101', subject_ids: ['all'] },
  { id: 'c2', name: 'Room 102', subject_ids: ['all'] },
  { id: 'c3', name: 'Lab A', subject_ids: ['s2'] },
  { id: 'c4', name: 'Lab B', subject_ids: ['s2'] },
  { id: 'c5', name: 'Art Studio', subject_ids: ['s5'] },
  { id: 'c6', name: 'Gym', subject_ids: ['s6'] },
];

const defaultStudentGroups: StudentGroup[] = [
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

const defaultTimeSlotDefs = [
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

function generateLessonSlots(timeSlotDefs: { start: string; end: string }[]): LessonSlot[] {
  const slots: LessonSlot[] = [];
  let id = 1;
  for (const day of days) {
    for (const ts of timeSlotDefs) {
      slots.push({ id: `ls${id++}`, day_of_week: day, start_time: ts.start, end_time: ts.end });
    }
  }
  return slots;
}

let idCounter = 100;
function genId(prefix: string) {
  return `${prefix}${idCounter++}`;
}

export function useAppData() {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);
  const [classrooms, setClassrooms] = useState<Classroom[]>(defaultClassrooms);
  const [studentGroups, setStudentGroups] = useState<StudentGroup[]>(defaultStudentGroups);
  const [timeSlotDefs, setTimeSlotDefs] = useState(defaultTimeSlotDefs);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);

  const lessonSlots = generateLessonSlots(timeSlotDefs);

  // Subjects
  const addSubject = useCallback((s: Omit<Subject, 'id'>) => {
    setSubjects(prev => [...prev, { ...s, id: genId('s') }]);
  }, []);
  const updateSubject = useCallback((id: string, s: Partial<Subject>) => {
    setSubjects(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
  }, []);
  const deleteSubject = useCallback((id: string) => {
    setSubjects(prev => prev.filter(x => x.id !== id));
  }, []);

  // Teachers
  const addTeacher = useCallback((t: Omit<Teacher, 'id'>) => {
    setTeachers(prev => [...prev, { ...t, id: genId('t') }]);
  }, []);
  const updateTeacher = useCallback((id: string, t: Partial<Teacher>) => {
    setTeachers(prev => prev.map(x => x.id === id ? { ...x, ...t } : x));
  }, []);
  const deleteTeacher = useCallback((id: string) => {
    setTeachers(prev => prev.filter(x => x.id !== id));
  }, []);

  // Classrooms
  const addClassroom = useCallback((c: Omit<Classroom, 'id'>) => {
    setClassrooms(prev => [...prev, { ...c, id: genId('c') }]);
  }, []);
  const updateClassroom = useCallback((id: string, c: Partial<Classroom>) => {
    setClassrooms(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  }, []);
  const deleteClassroom = useCallback((id: string) => {
    setClassrooms(prev => prev.filter(x => x.id !== id));
  }, []);

  // Student Groups
  const addStudentGroup = useCallback((g: Omit<StudentGroup, 'id'>) => {
    setStudentGroups(prev => [...prev, { ...g, id: genId('g') }]);
  }, []);
  const updateStudentGroup = useCallback((id: string, g: Partial<StudentGroup>) => {
    setStudentGroups(prev => prev.map(x => x.id === id ? { ...x, ...g } : x));
  }, []);
  const deleteStudentGroup = useCallback((id: string) => {
    setStudentGroups(prev => prev.filter(x => x.id !== id));
  }, []);

  // Time Slot Defs
  const addTimeSlot = useCallback((ts: { start: string; end: string }) => {
    setTimeSlotDefs(prev => [...prev, ts].sort((a, b) => a.start.localeCompare(b.start)));
  }, []);
  const updateTimeSlot = useCallback((index: number, ts: { start: string; end: string }) => {
    setTimeSlotDefs(prev => {
      const next = [...prev];
      next[index] = ts;
      return next.sort((a, b) => a.start.localeCompare(b.start));
    });
  }, []);
  const deleteTimeSlot = useCallback((index: number) => {
    setTimeSlotDefs(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Timetable entries
  const addEntry = useCallback((e: Omit<TimetableEntry, 'id'>) => {
    setTimetableEntries(prev => [...prev, { ...e, id: genId('te') }]);
  }, []);
  const deleteEntry = useCallback((id: string) => {
    setTimetableEntries(prev => prev.filter(x => x.id !== id));
  }, []);
  const setEntries = useCallback((entries: TimetableEntry[]) => {
    setTimetableEntries(entries);
  }, []);

  const getSubjectById = useCallback((id: string) => subjects.find(s => s.id === id), [subjects]);
  const getTeacherById = useCallback((id: string) => teachers.find(t => t.id === id), [teachers]);
  const getClassroomById = useCallback((id: string) => classrooms.find(c => c.id === id), [classrooms]);

  return {
    subjects, addSubject, updateSubject, deleteSubject,
    teachers, addTeacher, updateTeacher, deleteTeacher,
    classrooms, addClassroom, updateClassroom, deleteClassroom,
    studentGroups, addStudentGroup, updateStudentGroup, deleteStudentGroup,
    timeSlotDefs, addTimeSlot, updateTimeSlot, deleteTimeSlot,
    lessonSlots,
    timetableEntries, addEntry, deleteEntry, setEntries,
    getSubjectById, getTeacherById, getClassroomById,
  };
}

export type AppData = ReturnType<typeof useAppData>;
