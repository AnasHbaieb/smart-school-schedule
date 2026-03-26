import { TimetableEntry, LessonSlot, Teacher, Classroom, StudentGroup, Subject } from '@/types/timetable';

interface SchedulerInput {
  teachers: Teacher[];
  classrooms: Classroom[];
  subjects: Subject[];
  studentGroups: StudentGroup[];
  lessonSlots: LessonSlot[];
}

interface ConflictCheck {
  teacherConflict: boolean;
  classroomConflict: boolean;
  groupConflict: boolean;
}

export function checkConflicts(
  entries: TimetableEntry[],
  slotId: string,
  teacherId: string,
  classroomId: string,
  groupId: string,
  excludeEntryId?: string
): ConflictCheck {
  const slotEntries = entries.filter(
    e => e.lesson_slot_id === slotId && e.id !== excludeEntryId
  );

  return {
    teacherConflict: slotEntries.some(e => e.teacher_id === teacherId),
    classroomConflict: slotEntries.some(e => e.classroom_id === classroomId),
    groupConflict: slotEntries.some(e => e.student_group_id === groupId),
  };
}

export function hasAnyConflict(
  entries: TimetableEntry[],
  slotId: string,
  teacherId: string,
  classroomId: string,
  groupId: string,
  excludeEntryId?: string
): boolean {
  const c = checkConflicts(entries, slotId, teacherId, classroomId, groupId, excludeEntryId);
  return c.teacherConflict || c.classroomConflict || c.groupConflict;
}

function findClassroomForSubject(
  classrooms: Classroom[],
  subjectId: string,
  entries: TimetableEntry[],
  slotId: string
): Classroom | undefined {
  // Prefer specialized classrooms first, then general ones
  const specialized = classrooms.filter(
    c => c.subject_ids.includes(subjectId) && !c.subject_ids.includes('all')
  );
  const general = classrooms.filter(c => c.subject_ids.includes('all'));

  for (const c of [...specialized, ...general]) {
    const occupied = entries.some(e => e.lesson_slot_id === slotId && e.classroom_id === c.id);
    if (!occupied) return c;
  }
  return undefined;
}

function findTeacherForSubject(
  teachers: Teacher[],
  subjectId: string,
  entries: TimetableEntry[],
  slotId: string,
  teacherHoursUsed: Map<string, number>
): Teacher | undefined {
  const subjectTeachers = teachers.filter(t => t.subject_id === subjectId);

  for (const t of subjectTeachers) {
    const hoursUsed = teacherHoursUsed.get(t.id) || 0;
    if (hoursUsed >= t.hours_per_week) continue;
    const occupied = entries.some(e => e.lesson_slot_id === slotId && e.teacher_id === t.id);
    if (!occupied) return t;
  }
  return undefined;
}

export function autoSchedule(input: SchedulerInput): TimetableEntry[] {
  const { teachers, classrooms, subjects, studentGroups, lessonSlots } = input;
  const entries: TimetableEntry[] = [];
  const teacherHoursUsed = new Map<string, number>();
  let entryId = 1;

  // Sort slots by day then time for consistent scheduling
  const sortedSlots = [...lessonSlots].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayDiff = dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
    if (dayDiff !== 0) return dayDiff;
    return a.start_time.localeCompare(b.start_time);
  });

  // For each student group, schedule their subjects
  for (const group of studentGroups) {
    // Track remaining hours per subject for this group
    const remainingHours = new Map<string, number>();
    for (const gs of group.subjects) {
      remainingHours.set(gs.subject_id, gs.hours_per_week);
    }

    // Greedy: iterate slots and try to fill
    for (const slot of sortedSlots) {
      // Check if group already has a lesson in this slot
      const groupOccupied = entries.some(
        e => e.lesson_slot_id === slot.id && e.student_group_id === group.id
      );
      if (groupOccupied) continue;

      // Find a subject that still needs hours
      // Prioritize subjects with more remaining hours
      const subjectEntries = Array.from(remainingHours.entries())
        .filter(([, hrs]) => hrs > 0)
        .sort((a, b) => b[1] - a[1]);

      let scheduled = false;
      for (const [subjectId] of subjectEntries) {
        const teacher = findTeacherForSubject(teachers, subjectId, entries, slot.id, teacherHoursUsed);
        if (!teacher) continue;

        const classroom = findClassroomForSubject(classrooms, subjectId, entries, slot.id);
        if (!classroom) continue;

        entries.push({
          id: `auto_${entryId++}`,
          lesson_slot_id: slot.id,
          teacher_id: teacher.id,
          classroom_id: classroom.id,
          subject_id: subjectId,
          student_group_id: group.id,
        });

        remainingHours.set(subjectId, (remainingHours.get(subjectId) || 1) - 1);
        teacherHoursUsed.set(teacher.id, (teacherHoursUsed.get(teacher.id) || 0) + 1);
        scheduled = true;
        break;
      }
    }
  }

  return entries;
}

export function getScheduleStats(
  entries: TimetableEntry[],
  studentGroups: StudentGroup[],
  lessonSlots: LessonSlot[]
) {
  const conflicts: string[] = [];

  // Check for double-booking
  for (const slot of lessonSlots) {
    const slotEntries = entries.filter(e => e.lesson_slot_id === slot.id);

    // Teacher conflicts
    const teacherIds = slotEntries.map(e => e.teacher_id);
    const dupTeachers = teacherIds.filter((id, i) => teacherIds.indexOf(id) !== i);
    for (const t of dupTeachers) {
      conflicts.push(`Teacher ${t} double-booked on ${slot.day_of_week} ${slot.start_time}`);
    }

    // Classroom conflicts
    const classroomIds = slotEntries.map(e => e.classroom_id);
    const dupClassrooms = classroomIds.filter((id, i) => classroomIds.indexOf(id) !== i);
    for (const c of dupClassrooms) {
      conflicts.push(`Classroom ${c} double-booked on ${slot.day_of_week} ${slot.start_time}`);
    }

    // Group conflicts
    const groupIds = slotEntries.map(e => e.student_group_id);
    const dupGroups = groupIds.filter((id, i) => groupIds.indexOf(id) !== i);
    for (const g of dupGroups) {
      conflicts.push(`Group ${g} double-booked on ${slot.day_of_week} ${slot.start_time}`);
    }
  }

  // Coverage: how many required hours are fulfilled
  let totalRequired = 0;
  let totalFilled = 0;
  for (const group of studentGroups) {
    for (const gs of group.subjects) {
      totalRequired += gs.hours_per_week;
      const filled = entries.filter(
        e => e.student_group_id === group.id && e.subject_id === gs.subject_id
      ).length;
      totalFilled += Math.min(filled, gs.hours_per_week);
    }
  }

  return {
    conflicts,
    totalRequired,
    totalFilled,
    coveragePercent: totalRequired > 0 ? Math.round((totalFilled / totalRequired) * 100) : 100,
  };
}
