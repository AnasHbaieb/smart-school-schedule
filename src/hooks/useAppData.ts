import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Teacher, Classroom, Subject, StudentGroup, TimeSlotDef, LessonSlot, TimetableEntry, DayOfWeek, DAYS } from '@/types/timetable';

function generateLessonSlots(timeSlotDefs: TimeSlotDef[]): LessonSlot[] {
  const slots: LessonSlot[] = [];
  for (const ts of timeSlotDefs) {
    for (const day of ts.days) {
      slots.push({
        id: `${ts.id}_${day}`,
        day_of_week: day,
        start_time: ts.start_time,
        end_time: ts.end_time,
        time_slot_id: ts.id,
      });
    }
  }
  return slots;
}

export function useAppData() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
  const [timeSlotDefs, setTimeSlotDefs] = useState<TimeSlotDef[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const [subRes, teachRes, classRes, groupRes, slotRes, entryRes] = await Promise.all([
        supabase.from('subjects').select('*').order('created_at'),
        supabase.from('teachers').select('*').order('created_at'),
        supabase.from('classrooms').select('*').order('created_at'),
        supabase.from('student_groups').select('*').order('created_at'),
        supabase.from('time_slots').select('*').order('start_time'),
        supabase.from('timetable_entries').select('*'),
      ]);

      if (subRes.data) setSubjects(subRes.data.map((s: any) => ({ id: s.id, title: s.title, color: s.color })));
      if (teachRes.data) setTeachers(teachRes.data.map((t: any) => ({ id: t.id, name: t.name, subject_id: t.subject_id, hours_per_week: t.hours_per_week, sections: t.sections || [] })));
      if (classRes.data) setClassrooms(classRes.data.map((c: any) => ({ id: c.id, name: c.name, is_general: c.is_general, subject_ids: c.subject_ids || [] })));
      if (groupRes.data) setStudentGroups(groupRes.data.map((g: any) => ({ id: g.id, grade: g.grade, section: g.section, class_name: g.class_name || '', subjects: g.subjects || [] })));
      if (slotRes.data) setTimeSlotDefs(slotRes.data.map((s: any) => ({ id: s.id, start_time: s.start_time, end_time: s.end_time, days: (s.days || DAYS) as DayOfWeek[], is_lunch_break: s.is_lunch_break || false })));
      if (entryRes.data) setTimetableEntries(entryRes.data.map((e: any) => ({ id: e.id, time_slot_id: e.time_slot_id, day_of_week: e.day_of_week, teacher_id: e.teacher_id, classroom_id: e.classroom_id, subject_id: e.subject_id, student_group_id: e.student_group_id })));
      setLoading(false);
    }
    fetchAll();
  }, []);

  const lessonSlots = generateLessonSlots(timeSlotDefs);

  // Subjects
  const addSubject = useCallback(async (s: Omit<Subject, 'id'>) => {
    const { data, error } = await supabase.from('subjects').insert({ title: s.title, color: s.color }).select().single();
    if (error) { console.error(error); return; }
    setSubjects(prev => [...prev, { id: data.id, title: data.title, color: data.color }]);
  }, []);
  const updateSubject = useCallback(async (id: string, s: Partial<Subject>) => {
    const { error } = await supabase.from('subjects').update({ title: s.title, color: s.color }).eq('id', id);
    if (error) { console.error(error); return; }
    setSubjects(prev => prev.map(x => x.id === id ? { ...x, ...s } : x));
  }, []);
  const deleteSubject = useCallback(async (id: string) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setSubjects(prev => prev.filter(x => x.id !== id));
  }, []);

  // Teachers
  const addTeacher = useCallback(async (t: Omit<Teacher, 'id'>) => {
    const { data, error } = await supabase.from('teachers').insert({ name: t.name, subject_id: t.subject_id, hours_per_week: t.hours_per_week, sections: t.sections }).select().single();
    if (error) { console.error(error); return; }
    setTeachers(prev => [...prev, { id: data.id, name: data.name, subject_id: data.subject_id, hours_per_week: data.hours_per_week, sections: data.sections || [] }]);
  }, []);
  const updateTeacher = useCallback(async (id: string, t: Partial<Teacher>) => {
    const update: any = {};
    if (t.name !== undefined) update.name = t.name;
    if (t.subject_id !== undefined) update.subject_id = t.subject_id;
    if (t.hours_per_week !== undefined) update.hours_per_week = t.hours_per_week;
    if (t.sections !== undefined) update.sections = t.sections;
    const { error } = await supabase.from('teachers').update(update).eq('id', id);
    if (error) { console.error(error); return; }
    setTeachers(prev => prev.map(x => x.id === id ? { ...x, ...t } : x));
  }, []);
  const deleteTeacher = useCallback(async (id: string) => {
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setTeachers(prev => prev.filter(x => x.id !== id));
  }, []);

  // Classrooms
  const addClassroom = useCallback(async (c: Omit<Classroom, 'id'>) => {
    const { data, error } = await supabase.from('classrooms').insert({ name: c.name, is_general: c.is_general, subject_ids: c.subject_ids }).select().single();
    if (error) { console.error(error); return; }
    setClassrooms(prev => [...prev, { id: data.id, name: data.name, is_general: data.is_general, subject_ids: data.subject_ids || [] }]);
  }, []);
  const updateClassroom = useCallback(async (id: string, c: Partial<Classroom>) => {
    const update: any = {};
    if (c.name !== undefined) update.name = c.name;
    if (c.is_general !== undefined) update.is_general = c.is_general;
    if (c.subject_ids !== undefined) update.subject_ids = c.subject_ids;
    const { error } = await supabase.from('classrooms').update(update).eq('id', id);
    if (error) { console.error(error); return; }
    setClassrooms(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  }, []);
  const deleteClassroom = useCallback(async (id: string) => {
    const { error } = await supabase.from('classrooms').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setClassrooms(prev => prev.filter(x => x.id !== id));
  }, []);

  // Student Groups
  const addStudentGroup = useCallback(async (g: Omit<StudentGroup, 'id'>) => {
    const { data, error } = await supabase.from('student_groups').insert({ grade: g.grade, section: g.section, class_name: g.class_name, subjects: g.subjects as any }).select().single();
    if (error) { console.error(error); return; }
    setStudentGroups(prev => [...prev, { id: data.id, grade: data.grade, section: data.section, class_name: data.class_name || '', subjects: data.subjects as any || [] }]);
  }, []);
  const updateStudentGroup = useCallback(async (id: string, g: Partial<StudentGroup>) => {
    const update: any = {};
    if (g.grade !== undefined) update.grade = g.grade;
    if (g.section !== undefined) update.section = g.section;
    if (g.class_name !== undefined) update.class_name = g.class_name;
    if (g.subjects !== undefined) update.subjects = g.subjects;
    const { error } = await supabase.from('student_groups').update(update).eq('id', id);
    if (error) { console.error(error); return; }
    setStudentGroups(prev => prev.map(x => x.id === id ? { ...x, ...g } : x));
  }, []);
  const deleteStudentGroup = useCallback(async (id: string) => {
    const { error } = await supabase.from('student_groups').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setStudentGroups(prev => prev.filter(x => x.id !== id));
  }, []);

  // Time Slot Defs
  const addTimeSlot = useCallback(async (ts: Omit<TimeSlotDef, 'id'>) => {
    const { data, error } = await supabase.from('time_slots').insert({ start_time: ts.start_time, end_time: ts.end_time, days: ts.days, is_lunch_break: ts.is_lunch_break }).select().single();
    if (error) { console.error(error); return; }
    setTimeSlotDefs(prev => [...prev, { id: data.id, start_time: data.start_time, end_time: data.end_time, days: (data.days || DAYS) as DayOfWeek[], is_lunch_break: data.is_lunch_break || false }].sort((a, b) => a.start_time.localeCompare(b.start_time)));
  }, []);
  const updateTimeSlot = useCallback(async (id: string, ts: Partial<TimeSlotDef>) => {
    const update: any = {};
    if (ts.start_time !== undefined) update.start_time = ts.start_time;
    if (ts.end_time !== undefined) update.end_time = ts.end_time;
    if (ts.days !== undefined) update.days = ts.days;
    if (ts.is_lunch_break !== undefined) update.is_lunch_break = ts.is_lunch_break;
    const { error } = await supabase.from('time_slots').update(update).eq('id', id);
    if (error) { console.error(error); return; }
    setTimeSlotDefs(prev => prev.map(x => x.id === id ? { ...x, ...ts } : x).sort((a, b) => a.start_time.localeCompare(b.start_time)));
  }, []);
  const deleteTimeSlot = useCallback(async (id: string) => {
    const { error } = await supabase.from('time_slots').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setTimeSlotDefs(prev => prev.filter(x => x.id !== id));
  }, []);

  // Timetable entries
  const addEntry = useCallback(async (e: Omit<TimetableEntry, 'id'>) => {
    const { data, error } = await supabase.from('timetable_entries').insert({
      time_slot_id: e.time_slot_id, day_of_week: e.day_of_week,
      teacher_id: e.teacher_id, classroom_id: e.classroom_id,
      subject_id: e.subject_id, student_group_id: e.student_group_id
    }).select().single();
    if (error) { console.error(error); return; }
    setTimetableEntries(prev => [...prev, { id: data.id, time_slot_id: data.time_slot_id, day_of_week: data.day_of_week as DayOfWeek, teacher_id: data.teacher_id, classroom_id: data.classroom_id, subject_id: data.subject_id, student_group_id: data.student_group_id }]);
  }, []);
  const deleteEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from('timetable_entries').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setTimetableEntries(prev => prev.filter(x => x.id !== id));
  }, []);
  const setEntries = useCallback(async (entries: TimetableEntry[]) => {
    // Clear existing and insert new
    await supabase.from('timetable_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (entries.length > 0) {
      const inserts = entries.map(e => ({
        time_slot_id: e.time_slot_id, day_of_week: e.day_of_week,
        teacher_id: e.teacher_id, classroom_id: e.classroom_id,
        subject_id: e.subject_id, student_group_id: e.student_group_id
      }));
      const { data } = await supabase.from('timetable_entries').insert(inserts).select();
      if (data) {
        setTimetableEntries(data.map((e: any) => ({ id: e.id, time_slot_id: e.time_slot_id, day_of_week: e.day_of_week, teacher_id: e.teacher_id, classroom_id: e.classroom_id, subject_id: e.subject_id, student_group_id: e.student_group_id })));
        return;
      }
    }
    setTimetableEntries([]);
  }, []);

  const getSubjectById = useCallback((id: string) => subjects.find(s => s.id === id), [subjects]);
  const getTeacherById = useCallback((id: string) => teachers.find(t => t.id === id), [teachers]);
  const getClassroomById = useCallback((id: string) => classrooms.find(c => c.id === id), [classrooms]);

  return {
    loading,
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
