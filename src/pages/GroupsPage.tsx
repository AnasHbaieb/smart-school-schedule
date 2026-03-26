import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, GraduationCap, Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function GroupsPage() {
  const { studentGroups, subjects, addStudentGroup, updateStudentGroup, deleteStudentGroup, getSubjectById } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [subjectHours, setSubjectHours] = useState<{ subject_id: string; hours_per_week: number }[]>([]);

  const openAdd = () => {
    setEditId(null); setGrade(''); setSection('');
    setSubjectHours(subjects.map(s => ({ subject_id: s.id, hours_per_week: 0 })));
    setDialogOpen(true);
  };
  const openEdit = (id: string) => {
    const g = studentGroups.find(x => x.id === id);
    if (!g) return;
    setEditId(id); setGrade(g.grade); setSection(g.section);
    // Merge with all subjects
    setSubjectHours(subjects.map(s => {
      const existing = g.subjects.find(gs => gs.subject_id === s.id);
      return { subject_id: s.id, hours_per_week: existing?.hours_per_week || 0 };
    }));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!grade || !section) { toast.error('Please fill grade and section'); return; }
    const activeSubjects = subjectHours.filter(s => s.hours_per_week > 0);
    if (activeSubjects.length === 0) { toast.error('Add at least one subject with hours'); return; }
    const data = { grade, section, subjects: activeSubjects };
    if (editId) { updateStudentGroup(editId, data); toast.success('Group updated'); }
    else { addStudentGroup(data); toast.success('Group added'); }
    setDialogOpen(false);
  };

  const setHoursForSubject = (subjectId: string, hours: number) => {
    setSubjectHours(prev => prev.map(s => s.subject_id === subjectId ? { ...s, hours_per_week: hours } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Groups</h1>
          <p className="text-muted-foreground mt-1">Manage grades, sections, and their subject allocations.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> Add Group</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            All Groups ({studentGroups.length})
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
              {studentGroups.map(g => (
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
                    <Button variant="ghost" size="sm" onClick={() => openEdit(g.id)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { deleteStudentGroup(g.id); toast.success('Group deleted'); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit Student Group' : 'Add Student Group'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">Grade</label><Input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. 10" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Section</label><Input value={section} onChange={e => setSection(e.target.value)} placeholder="e.g. A" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subjects & Hours/Week</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {subjectHours.map(sh => {
                  const sub = getSubjectById(sh.subject_id);
                  return (
                    <div key={sh.subject_id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: sub?.color }} />
                      <span className="text-sm flex-1">{sub?.title}</span>
                      <Input type="number" className="w-20" min={0} value={sh.hours_per_week} onChange={e => setHoursForSubject(sh.subject_id, parseInt(e.target.value) || 0)} />
                      <span className="text-xs text-muted-foreground">h/w</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
