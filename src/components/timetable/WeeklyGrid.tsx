import { useMemo } from 'react';
import { DAYS, DAY_SHORT, DayOfWeek, TimetableEntry, LessonSlot, Subject, Teacher, Classroom } from '@/types/timetable';
import { cn } from '@/lib/utils';

interface WeeklyGridProps {
  entries: TimetableEntry[];
  lessonSlots: LessonSlot[];
  filterGroupId?: string;
  filterTeacherId?: string;
  getSubjectById: (id: string) => Subject | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getClassroomById: (id: string) => Classroom | undefined;
}

export function WeeklyGrid({
  entries,
  lessonSlots,
  filterGroupId,
  filterTeacherId,
  getSubjectById,
  getTeacherById,
  getClassroomById,
}: WeeklyGridProps) {
  const safeSlots = lessonSlots || [];
  const safeEntries = entries || [];

  const timeSlots = useMemo(() => {
    const seen = new Map<string, { start: string; end: string }>();
    for (const ls of safeSlots) {
      const key = `${ls.start_time}-${ls.end_time}`;
      if (!seen.has(key)) seen.set(key, { start: ls.start_time, end: ls.end_time });
    }
    return Array.from(seen.values()).sort((a, b) => a.start.localeCompare(b.start));
  }, [safeSlots]);

  const entryMap = useMemo(() => {
    const map = new Map<string, TimetableEntry[]>();
    let filtered = entries;
    if (filterGroupId) filtered = filtered.filter(e => e.student_group_id === filterGroupId);
    if (filterTeacherId) filtered = filtered.filter(e => e.teacher_id === filterTeacherId);

    for (const entry of filtered) {
      const slot = lessonSlots.find(ls => ls.id === entry.lesson_slot_id);
      if (slot) {
        const key = `${slot.day_of_week}-${slot.start_time}-${slot.end_time}`;
        const list = map.get(key) || [];
        list.push(entry);
        map.set(key, list);
      }
    }
    return map;
  }, [entries, lessonSlots, filterGroupId, filterTeacherId]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-1 mb-1">
          <div className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</div>
          {DAYS.map(day => (
            <div key={day} className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-card rounded-lg">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{DAY_SHORT[day]}</span>
            </div>
          ))}
        </div>

        {timeSlots.map(ts => {
          const isBreak = ts.start === '12:20' || ts.start === '13:05';
          return (
            <div key={`${ts.start}-${ts.end}`} className="grid grid-cols-[100px_repeat(6,1fr)] gap-1 mb-1">
              <div className={cn("flex flex-col justify-center px-3 py-2 text-xs font-medium", isBreak ? "text-accent" : "text-muted-foreground")}>
                <span>{ts.start}</span>
                <span className="text-[10px] opacity-60">{ts.end}</span>
              </div>

              {DAYS.map(day => {
                const key = `${day}-${ts.start}-${ts.end}`;
                const cellEntries = entryMap.get(key) || [];

                if (cellEntries.length === 0) {
                  return (
                    <div key={key} className="bg-card/50 rounded-lg border border-border/50 min-h-[60px] flex items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <span className="text-xs text-muted-foreground/30">—</span>
                    </div>
                  );
                }

                // Show first entry (or stack if multiple due to "all groups" view)
                const entry = cellEntries[0];
                const subject = getSubjectById(entry.subject_id);
                const teacher = getTeacherById(entry.teacher_id);
                const classroom = getClassroomById(entry.classroom_id);

                return (
                  <div
                    key={key}
                    className="rounded-lg min-h-[60px] p-2 flex flex-col justify-between text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-sm relative"
                    style={{ backgroundColor: subject?.color || 'hsl(var(--muted))' }}
                  >
                    <span className="text-xs font-semibold leading-tight truncate">{subject?.title}</span>
                    <div className="text-[10px] opacity-80 space-y-0.5">
                      <div className="truncate">{teacher?.name}</div>
                      <div className="truncate">{classroom?.name}</div>
                    </div>
                    {cellEntries.length > 1 && (
                      <span className="absolute top-1 right-1 bg-white/30 text-[9px] px-1 rounded">+{cellEntries.length - 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
