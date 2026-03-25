import { mockSubjects } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage subjects and weekly hour allocations.</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Subject</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            All Subjects ({mockSubjects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Weekly Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubjects.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="w-5 h-5 rounded-md" style={{ backgroundColor: s.color }} />
                  </TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell>{s.weekly_hours}h / week</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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
