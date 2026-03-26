import { useData } from '@/contexts/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DoorOpen, GraduationCap, Calendar, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { getScheduleStats } from '@/lib/scheduler';

export default function Dashboard() {
  const { teachers, classrooms, studentGroups, subjects, timetableEntries, lessonSlots, timeSlotDefs } = useData();

  const stats = getScheduleStats(timetableEntries, studentGroups, lessonSlots);

  const cards = [
    { label: 'Teachers', value: teachers.length, icon: Users, color: 'text-primary' },
    { label: 'Classrooms', value: classrooms.length, icon: DoorOpen, color: 'text-[hsl(25,95%,53%)]' },
    { label: 'Student Groups', value: studentGroups.length, icon: GraduationCap, color: 'text-[hsl(340,65%,55%)]' },
    { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'text-[hsl(280,65%,60%)]' },
    { label: 'Time Slots', value: timeSlotDefs.length, icon: Clock, color: 'text-[hsl(167,72%,42%)]' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to SmartTimetable — manage your school schedule.</p>
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
              Scheduled Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{timetableEntries.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Total lessons scheduled this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Conflicts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${stats.conflicts.length > 0 ? 'text-destructive' : 'text-accent'}`}>{stats.conflicts.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.conflicts.length > 0 ? 'Scheduling conflicts detected!' : 'No scheduling conflicts detected'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-[hsl(280,65%,60%)]" />
              Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold" style={{ color: stats.coveragePercent >= 80 ? 'hsl(167 72% 42%)' : 'hsl(25 95% 53%)' }}>
              {stats.coveragePercent}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.totalFilled}/{stats.totalRequired} required hours filled
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
