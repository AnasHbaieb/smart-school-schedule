import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTeachers, mockClassrooms, mockStudentGroups, mockTimetableEntries } from '@/data/mockData';
import { Users, DoorOpen, GraduationCap, Calendar, AlertTriangle } from 'lucide-react';

const stats = [
  { label: 'Teachers', value: mockTeachers.length, icon: Users, color: 'text-primary' },
  { label: 'Classrooms', value: mockClassrooms.length, icon: DoorOpen, color: 'text-[hsl(25,95%,53%)]' },
  { label: 'Student Groups', value: mockStudentGroups.length, icon: GraduationCap, color: 'text-[hsl(340,65%,55%)]' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to SmartTimetable — manage your school schedule.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(s => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Scheduled Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{mockTimetableEntries.length}</div>
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
            <div className="text-4xl font-bold text-accent">0</div>
            <p className="text-sm text-muted-foreground mt-1">No scheduling conflicts detected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
