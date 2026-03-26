import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen, Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [weeklyHours, setWeeklyHours] = useState('');
  const [color, setColor] = useState('hsl(243 75% 59%)');

  const openAdd = () => { setEditId(null); setTitle(''); setWeeklyHours(''); setColor('hsl(243 75% 59%)'); setDialogOpen(true); };
  const openEdit = (id: string) => {
    const s = subjects.find(x => x.id === id);
    if (!s) return;
    setEditId(id); setTitle(s.title); setWeeklyHours(String(s.weekly_hours)); setColor(s.color);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!title || !weeklyHours) { toast.error('Please fill all fields'); return; }
    const data = { title, weekly_hours: parseInt(weeklyHours), color };
    if (editId) { updateSubject(editId, data); toast.success('Subject updated'); }
    else { addSubject(data); toast.success('Subject added'); }
    setDialogOpen(false);
  };

  const presetColors = [
    'hsl(243 75% 59%)', 'hsl(167 72% 42%)', 'hsl(25 95% 53%)',
    'hsl(340 65% 55%)', 'hsl(280 65% 60%)', 'hsl(200 80% 50%)',
    'hsl(150 60% 40%)', 'hsl(30 80% 55%)', 'hsl(0 70% 50%)',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage subjects and weekly hour allocations.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> Add Subject</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            All Subjects ({subjects.length})
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
              {subjects.map(s => (
                <TableRow key={s.id}>
                  <TableCell><div className="w-5 h-5 rounded-md" style={{ backgroundColor: s.color }} /></TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell>{s.weekly_hours}h / week</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(s.id)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { deleteSubject(s.id); toast.success('Subject deleted'); }}>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Subject' : 'Add Subject'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><label className="text-sm font-medium">Title</label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">Weekly Hours</label><Input type="number" value={weeklyHours} onChange={e => setWeeklyHours(e.target.value)} /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2 flex-wrap">
                {presetColors.map(c => (
                  <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-md border-2 transition-transform ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
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
