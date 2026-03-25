import { mockStudentGroups, getSubjectById } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, GraduationCap, Trash2 } from 'lucide-react';

export default function GroupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Groups</h1>
          <p className="text-muted-foreground mt-1">Manage grades, sections, and their subject allocations.</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Group</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            All Groups ({mockStudentGroups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudentGroups.map(g => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">Grade {g.grade}</TableCell>
                  <TableCell>Section {g.section}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {g.subjects.map(s => {
                        const sub = getSubjectById(s.subject_id);
                        return (
                          <span key={s.subject_id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: sub?.color }}>
                            {sub?.title} ({s.hours_per_week}h)
                          </span>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
