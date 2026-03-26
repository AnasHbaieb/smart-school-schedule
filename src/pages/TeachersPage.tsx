import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Trash2, Pencil, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function TeachersPage() {
  const { teachers, subjects, addTeacher, updateTeacher, deleteTeacher, getSubjectById } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [hours, setHours] = useState('');
  const [sectionInput, setSectionInput] = useState('');
  const [sections, setSections] = useState<string[]>([]);

  const openAdd = () => {
    setEditId(null); setName(''); setSubjectId(subjects[0]?.id || ''); setHours(''); setSections([]); setSectionInput('');
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const t = teachers.find(x => x.id === id);
    if (!t) return;
    setEditId(id); setName(t.name); setSubjectId(t.subject_id); setHours(String(t.hours_per_week)); setSections([...t.sections]); setSectionInput('');
    setDialogOpen(true);
  };

  const addSection = () => {
    const val = sectionInput.trim();
    if (!val) return;
    if (sections.includes(val)) { toast.error('Already added'); return; }
    setSections(prev => [...prev, val]);
    setSectionInput('');
  };

  const removeSection = (s: string) => {
    setSections(prev => prev.filter(x => x !== s));
  };

  const handleSave = () => {
    if (!name || !subjectId || !hours) { toast.error('Please fill all fields'); return; }
    if (sections.length === 0) { toast.error('Add at least one grade/section'); return; }
    const data = { name, subject_id: subjectId, hours_per_week: parseInt(hours), sections };
    if (editId) { updateTeacher(editId, data); toast.success('Teacher updated'); }
    else { addTeacher(data); toast.success('Teacher added'); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground mt-1">Manage teaching staff and their subjects.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> Add Teacher</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            All Teachers ({teachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Hours/Week</TableHead>
                <TableHead>Grade / Section</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map(t => {
                const subject = getSubjectById(t.subject_id);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: subject?.color }}>
                        {subject?.title}
                      </span>
                    </TableCell>
                    <TableCell>{t.hours_per_week}h</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {t.sections.map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(t.id)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { deleteTeacher(t.id); toast.success('Teacher deleted'); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {teachers.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No teachers yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><label className="text-sm font-medium">Name</label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium">Hours/Week</label><Input type="number" value={hours} onChange={e => setHours(e.target.value)} /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Grade / Section (e.g. 10A, 11B)</label>
              <div className="flex gap-2">
                <Input value={sectionInput} onChange={e => setSectionInput(e.target.value)} placeholder="e.g. 10A" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSection())} />
                <Button type="button" variant="outline" onClick={addSection}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {sections.map(s => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button onClick={() => removeSection(s)}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
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
