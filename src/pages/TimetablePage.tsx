import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { WeeklyGrid } from '@/components/timetable/WeeklyGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Wand2, Trash2 } from 'lucide-react';
import { autoSchedule } from '@/lib/scheduler';
import { toast } from 'sonner';

export default function TimetablePage() {
  const data = useData();
  const { studentGroups, teachers, subjects, classrooms, lessonSlots, timetableEntries, setEntries } = data;
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');

  const handleAutoSchedule = () => {
    const entries = autoSchedule({
      teachers,
      classrooms,
      subjects,
      studentGroups,
      lessonSlots,
    });
    setEntries(entries);
    toast.success(`Auto-scheduled ${entries.length} lessons`);
  };

  const handleClear = () => {
    setEntries([]);
    toast.success('Timetable cleared');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Timetable</h1>
          <p className="text-muted-foreground mt-1">View and manage the weekly schedule grid.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleClear}>
            <Trash2 className="w-4 h-4" /> Clear
          </Button>
          <Button className="gap-2" onClick={handleAutoSchedule}>
            <Wand2 className="w-4 h-4" /> Auto Schedule
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Student Group" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {studentGroups.map(g => (
              <SelectItem key={g.id} value={g.id}>Grade {g.grade} - {g.section}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={teacherFilter} onValueChange={setTeacherFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Teacher" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teachers</SelectItem>
            {teachers.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <WeeklyGrid
        entries={timetableEntries}
        lessonSlots={lessonSlots}
        filterGroupId={groupFilter === 'all' ? undefined : groupFilter}
        filterTeacherId={teacherFilter === 'all' ? undefined : teacherFilter}
        getSubjectById={data.getSubjectById}
        getTeacherById={data.getTeacherById}
        getClassroomById={data.getClassroomById}
      />

      <div className="flex flex-wrap gap-3">
        {subjects.map(s => (
          <div key={s.id} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.title}
          </div>
        ))}
      </div>
    </div>
  );
}
