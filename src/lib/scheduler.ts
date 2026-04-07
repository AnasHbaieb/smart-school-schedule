import { TimetableEntry, LessonSlot, Teacher, Classroom, StudentGroup, Subject, TimeSlotDef } from '@/types/timetable';

interface SchedulerInput {
  teachers: Teacher[];
  classrooms: Classroom[];
  subjects: Subject[];
  studentGroups: StudentGroup[];
  lessonSlots: LessonSlot[];
  timeSlotDefs?: TimeSlotDef[];
}

/**
 * Get lunch-adjacent slot info for dynamic scheduling.
 * Rule: at least one of the slots immediately before/after lunch must be free (rest).
 * You CAN study in one adjacent slot, but NOT both.
 */
function getLunchAdjacentInfo(timeSlotDefs: TimeSlotDef[]): {
  lunchIds: Set<string>;
  adjacentPairs: Array<{ before: string | null; after: string | null }>;
} {
  const lunchIds = new Set<string>();
  const adjacentPairs: Array<{ before: string | null; after: string | null }> = [];
  const sorted = [...timeSlotDefs].sort((a, b) => a.start_time.localeCompare(b.start_time));

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].is_lunch_break) {
      lunchIds.add(sorted[i].id);
      adjacentPairs.push({
        before: i - 1 >= 0 ? sorted[i - 1].id : null,
        after: i + 1 < sorted.length ? sorted[i + 1].id : null,
      });
    }
  }

  return { lunchIds, adjacentPairs };
}

export function autoSchedule(input: SchedulerInput): TimetableEntry[] {
  const { teachers, classrooms, subjects, studentGroups, lessonSlots, timeSlotDefs } = input;
  const entries: TimetableEntry[] = [];
  const teacherHoursUsed = new Map<string, number>();
  let entryId = 1;

  // Compute lunch break info for dynamic adjacency check
  const { lunchIds, adjacentPairs } = timeSlotDefs
    ? getLunchAdjacentInfo(timeSlotDefs)
    : { lunchIds: new Set<string>(), adjacentPairs: [] };

  const sortedSlots = [...lessonSlots].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayDiff = dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
    if (dayDiff !== 0) return dayDiff;
    return a.start_time.localeCompare(b.start_time);
  });

  for (const group of studentGroups) {
    const remainingHours = new Map<string, number>();
    for (const gs of group.subjects) {
      remainingHours.set(gs.subject_id, gs.hours_per_week);
    }

    for (const slot of sortedSlots) {
      // Skip lunch break slots
      if (lunchIds.has(slot.time_slot_id)) continue;

      // Check lunch adjacency rule: can't study BOTH before and after lunch
      let blockedByLunch = false;
      for (const pair of adjacentPairs) {
        const isBeforeSlot = pair.before === slot.time_slot_id;
        const isAfterSlot = pair.after === slot.time_slot_id;
        if (isBeforeSlot) {
          // This slot is before lunch; check if after-lunch slot already has a lesson for this group
          if (pair.after && entries.some(e => e.time_slot_id === pair.after && e.day_of_week === slot.day_of_week && e.student_group_id === group.id)) {
            blockedByLunch = true;
          }
        }
        if (isAfterSlot) {
          // This slot is after lunch; check if before-lunch slot already has a lesson for this group
          if (pair.before && entries.some(e => e.time_slot_id === pair.before && e.day_of_week === slot.day_of_week && e.student_group_id === group.id)) {
            blockedByLunch = true;
          }
        }
      }
      if (blockedByLunch) continue;

      const groupOccupied = entries.some(
        e => e.time_slot_id === slot.time_slot_id && e.day_of_week === slot.day_of_week && e.student_group_id === group.id
      );
      if (groupOccupied) continue;

      const subjectEntries = Array.from(remainingHours.entries())
        .filter(([, hrs]) => hrs > 0)
        .sort((a, b) => b[1] - a[1]);

      for (const [subjectId] of subjectEntries) {
        const subjectTeachers = teachers.filter(t => t.subject_id === subjectId);
        let foundTeacher: Teacher | undefined;
        for (const t of subjectTeachers) {
          const hoursUsed = teacherHoursUsed.get(t.id) || 0;
          if (hoursUsed >= t.hours_per_week) continue;
          const occupied = entries.some(e => e.time_slot_id === slot.time_slot_id && e.day_of_week === slot.day_of_week && e.teacher_id === t.id);
          if (!occupied) { foundTeacher = t; break; }
        }
        if (!foundTeacher) continue;

        // Find classroom
        const specialized = classrooms.filter(c => !c.is_general && c.subject_ids.includes(subjectId));
        const general = classrooms.filter(c => c.is_general);
        let foundClassroom: Classroom | undefined;
        for (const c of [...specialized, ...general]) {
          const occupied = entries.some(e => e.time_slot_id === slot.time_slot_id && e.day_of_week === slot.day_of_week && e.classroom_id === c.id);
          if (!occupied) { foundClassroom = c; break; }
        }
        if (!foundClassroom) continue;

        entries.push({
          id: `auto_${entryId++}`,
          time_slot_id: slot.time_slot_id,
          day_of_week: slot.day_of_week,
          teacher_id: foundTeacher.id,
          classroom_id: foundClassroom.id,
          subject_id: subjectId,
          student_group_id: group.id,
        });

        remainingHours.set(subjectId, (remainingHours.get(subjectId) || 1) - 1);
        teacherHoursUsed.set(foundTeacher.id, (teacherHoursUsed.get(foundTeacher.id) || 0) + 1);
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

  const slotKeys = new Set(entries.map(e => `${e.time_slot_id}_${e.day_of_week}`));
  for (const key of slotKeys) {
    const slotEntries = entries.filter(e => `${e.time_slot_id}_${e.day_of_week}` === key);

    const teacherIds = slotEntries.map(e => e.teacher_id);
    const dupTeachers = teacherIds.filter((id, i) => teacherIds.indexOf(id) !== i);
    for (const t of dupTeachers) conflicts.push(`Teacher double-booked: ${key}`);

    const classroomIds = slotEntries.map(e => e.classroom_id);
    const dupClassrooms = classroomIds.filter((id, i) => classroomIds.indexOf(id) !== i);
    for (const c of dupClassrooms) conflicts.push(`Classroom double-booked: ${key}`);

    const groupIds = slotEntries.map(e => e.student_group_id);
    const dupGroups = groupIds.filter((id, i) => groupIds.indexOf(id) !== i);
    for (const g of dupGroups) conflicts.push(`Group double-booked: ${key}`);
  }

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