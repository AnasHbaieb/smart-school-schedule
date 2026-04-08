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

/**
 * Check if placing a lesson at slotIndex for a given day would create a gap
 * in the entity's (group or teacher) schedule for that day.
 * A gap = an empty non-lunch slot between two occupied slots.
 */
function wouldCreateGap(
  occupiedSlotIndices: number[],
  candidateIndex: number,
  nonLunchIndices: number[]
): boolean {
  const allOccupied = new Set([...occupiedSlotIndices, candidateIndex]);
  if (allOccupied.size <= 1) return false;

  // Only consider non-lunch slot positions
  const relevantIndices = nonLunchIndices.filter(i => allOccupied.has(i));
  if (relevantIndices.length <= 1) return false;

  // Sort them
  relevantIndices.sort((a, b) => a - b);

  // Check for gaps: any non-lunch slot between min and max that is not occupied
  for (let k = 0; k < relevantIndices.length - 1; k++) {
    const from = relevantIndices[k];
    const to = relevantIndices[k + 1];
    for (const idx of nonLunchIndices) {
      if (idx > from && idx < to && !allOccupied.has(idx)) {
        return true; // gap found
      }
    }
  }
  return false;
}

export function autoSchedule(input: SchedulerInput): TimetableEntry[] {
  const { teachers, classrooms, subjects, studentGroups, lessonSlots, timeSlotDefs } = input;
  const entries: TimetableEntry[] = [];
  const teacherHoursUsed = new Map<string, number>();
  // Track which teacher is assigned to each (group, subject) pair
  const groupSubjectTeacher = new Map<string, string>();
  let entryId = 1;

  // Compute lunch break info for dynamic adjacency check
  const { lunchIds, adjacentPairs } = timeSlotDefs
    ? getLunchAdjacentInfo(timeSlotDefs)
    : { lunchIds: new Set<string>(), adjacentPairs: [] };

  // Build sorted time slot order for gap detection
  const sortedTimeSlotDefs = timeSlotDefs
    ? [...timeSlotDefs].sort((a, b) => a.start_time.localeCompare(b.start_time))
    : [];
  const timeSlotIndexMap = new Map<string, number>();
  sortedTimeSlotDefs.forEach((ts, i) => timeSlotIndexMap.set(ts.id, i));

  // Lunch-adjacent slot IDs (rest slots that should not count as gaps)
  const lunchAdjacentIds = new Set<string>();
  for (const pair of adjacentPairs) {
    if (pair.before) lunchAdjacentIds.add(pair.before);
    if (pair.after) lunchAdjacentIds.add(pair.after);
  }

  // Non-lunch and non-lunch-adjacent slot indices for gap checking
  const nonLunchIndices = sortedTimeSlotDefs
    .map((ts, i) => ({ i, id: ts.id, isLunch: ts.is_lunch_break }))
    .filter(x => !x.isLunch && !lunchAdjacentIds.has(x.id))
    .map(x => x.i);

  const sortedSlots = [...lessonSlots].sort((a, b) => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayDiff = dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
    if (dayDiff !== 0) return dayDiff;
    return a.start_time.localeCompare(b.start_time);
  });

  // Helper to get occupied slot indices for an entity on a day
  function getOccupiedIndices(day: string, entityKey: 'student_group_id' | 'teacher_id', entityId: string): number[] {
    return entries
      .filter(e => e.day_of_week === day && e[entityKey] === entityId)
      .map(e => timeSlotIndexMap.get(e.time_slot_id) ?? -1)
      .filter(i => i >= 0);
  }

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
          if (pair.after && entries.some(e => e.time_slot_id === pair.after && e.day_of_week === slot.day_of_week && e.student_group_id === group.id)) {
            blockedByLunch = true;
          }
        }
        if (isAfterSlot) {
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

      const candidateIndex = timeSlotIndexMap.get(slot.time_slot_id) ?? -1;

      // No-gap check for student group
      if (candidateIndex >= 0) {
        const groupSlots = getOccupiedIndices(slot.day_of_week, 'student_group_id', group.id);
        if (wouldCreateGap(groupSlots, candidateIndex, nonLunchIndices)) continue;
      }

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
          if (occupied) continue;

          // No-gap check for teacher
          if (candidateIndex >= 0) {
            const teacherSlots = getOccupiedIndices(slot.day_of_week, 'teacher_id', t.id);
            if (wouldCreateGap(teacherSlots, candidateIndex, nonLunchIndices)) continue;
          }

          foundTeacher = t;
          break;
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