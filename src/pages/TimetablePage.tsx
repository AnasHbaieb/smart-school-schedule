import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { useLang } from '@/contexts/LanguageContext';
import { WeeklyGrid } from '@/components/timetable/WeeklyGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Wand2, Trash2 } from 'lucide-react';
import { autoSchedule } from '@/lib/scheduler';
import { toast } from 'sonner';

export default function TimetablePage() {
  const data = useData();
  const { studentGroups, teachers, subjects, classrooms, lessonSlots, timetableEntries, setEntries, timeSlotDefs } = data;
  const { t } = useLang();
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [teacherFilter, setTeacherFilter] = useState<string>('all');

  const handleAutoSchedule = () => {
    const entries = autoSchedule({
      teachers,
      classrooms,
      subjects,
      studentGroups,
      lessonSlots,
      timeSlotDefs,
    });
    setEntries(entries);
    toast.success(`${t('autoScheduled')} ${entries.length} ${t('lessons')}`);
  };

  const handleClear = () => {
    setEntries([]);
    toast.success(t('timetableCleared'));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('weeklyTimetable')}</h1>
          <p className="text-muted-foreground mt-1">{t('timetableSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleClear}>
            <Trash2 className="w-4 h-4" /> {t('clear')}
          </Button>
          <Button className="gap-2" onClick={handleAutoSchedule}>
            <Wand2 className="w-4 h-4" /> {t('autoSchedule')}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder={t('studentGroup')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allGroups')}</SelectItem>
            {studentGroups.map(g => (
              <SelectItem key={g.id} value={g.id}>
                {t('grade')} {g.grade} - {g.section}{g.class_name ? ` - ${g.class_name}` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={teacherFilter} onValueChange={setTeacherFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder={t('teacher')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTeachers')}</SelectItem>
            {teachers.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <WeeklyGrid
        entries={timetableEntries}
        lessonSlots={lessonSlots}
        timeSlotDefs={timeSlotDefs}
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
