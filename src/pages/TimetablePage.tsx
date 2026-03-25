import { useState } from 'react';
import { WeeklyGrid } from '@/components/timetable/WeeklyGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockStudentGroups, mockTeachers } from '@/data/mockData';

export default function TimetablePage() {
  const [groupFilter, setGroupFilter] = useState<string>('g1');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Weekly Timetable</h1>
        <p className="text-muted-foreground mt-1">View and manage the weekly schedule grid.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Student Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {mockStudentGroups.map(g => (
              <SelectItem key={g.id} value={g.id}>
                Grade {g.grade} - {g.section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={teacherFilter} onValueChange={setTeacherFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Teacher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teachers</SelectItem>
            {mockTeachers.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <WeeklyGrid
        filterGroupId={groupFilter === 'all' ? undefined : groupFilter}
        filterTeacherId={teacherFilter === 'all' ? undefined : teacherFilter}
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Mathematics', color: 'hsl(243 75% 59%)' },
          { label: 'Science', color: 'hsl(167 72% 42%)' },
          { label: 'English', color: 'hsl(25 95% 53%)' },
          { label: 'History', color: 'hsl(340 65% 55%)' },
          { label: 'Art', color: 'hsl(280 65% 60%)' },
          { label: 'Physical Ed', color: 'hsl(200 80% 50%)' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}
