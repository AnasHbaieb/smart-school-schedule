import { useData } from '@/contexts/AppDataContext';
import { useLang } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DoorOpen, GraduationCap, Calendar, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { getScheduleStats } from '@/lib/scheduler';

export default function Dashboard() {
  const { teachers, classrooms, studentGroups, subjects, timetableEntries, lessonSlots, timeSlotDefs, loading } = useData();
  const { t } = useLang();

  const stats = getScheduleStats(timetableEntries, studentGroups, lessonSlots);

  const cards = [
    { label: t('teachers'), value: teachers.length, icon: Users, color: 'text-primary' },
    { label: t('classrooms'), value: classrooms.length, icon: DoorOpen, color: 'text-[hsl(25,95%,53%)]' },
    { label: t('studentGroups'), value: studentGroups.length, icon: GraduationCap, color: 'text-[hsl(340,65%,55%)]' },
    { label: t('subjects'), value: subjects.length, icon: BookOpen, color: 'text-[hsl(280,65%,60%)]' },
    { label: t('timeSlots'), value: timeSlotDefs.length, icon: Clock, color: 'text-[hsl(167,72%,42%)]' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">{t('loadingData')}</p></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboardTitle')}</h1>
        <p className="text-muted-foreground mt-1">{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(s => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              {t('scheduledLessons')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{timetableEntries.length}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('totalLessonsScheduled')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              {t('conflicts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${stats.conflicts.length > 0 ? 'text-destructive' : 'text-accent'}`}>{stats.conflicts.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.conflicts.length > 0 ? t('conflictsDetected') : t('noConflicts')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-[hsl(280,65%,60%)]" />
              {t('coverage')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" style={{ color: stats.coveragePercent >= 80 ? 'hsl(167 72% 42%)' : 'hsl(25 95% 53%)' }}>
              {stats.coveragePercent}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.totalFilled}/{stats.totalRequired} {t('requiredHoursFilled')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
