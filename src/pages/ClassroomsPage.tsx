import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, DoorOpen, Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ClassroomsPage() {
  const { classrooms, subjects, addClassroom, updateClassroom, deleteClassroom, getSubjectById } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isGeneral, setIsGeneral] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const openAdd = () => { setEditId(null); setName(''); setIsGeneral(true); setSelectedSubjects([]); setDialogOpen(true); };
  const openEdit = (id: string) => {
    const c = classrooms.find(x => x.id === id);
    if (!c) return;
    setEditId(id); setName(c.name);
    setIsGeneral(c.is_general);
    setSelectedSubjects(c.is_general ? [] : [...c.subject_ids]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name) { toast.error('Please enter a name'); return; }
    if (!isGeneral && selectedSubjects.length === 0) { toast.error('Select at least one subject'); return; }
    const data = { name, is_general: isGeneral, subject_ids: isGeneral ? [] : selectedSubjects };
    if (editId) { updateClassroom(editId, data); toast.success('Classroom updated'); }
    else { addClassroom(data); toast.success('Classroom added'); }
    setDialogOpen(false);
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
          <p className="text-muted-foreground mt-1">Manage rooms and their assigned subjects.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> Add Classroom</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-primary" />
            All Classrooms ({classrooms.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classrooms.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    {c.is_general ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">All</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {c.subject_ids.map(sid => {
                          const sub = getSubjectById(sid);
                          return <span key={sid} className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: sub?.color }}>{sub?.title}</span>;
                        })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(c.id)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { deleteClassroom(c.id); toast.success('Classroom deleted'); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {classrooms.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No classrooms yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Classroom' : 'Add Classroom'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><label className="text-sm font-medium">Name</label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={isGeneral} onCheckedChange={() => { setIsGeneral(true); setSelectedSubjects([]); }} />
                  <span className="text-sm">Regular (All subjects)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={!isGeneral} onCheckedChange={() => setIsGeneral(false)} />
                  <span className="text-sm">Specialized</span>
                </label>
              </div>
            </div>
            {!isGeneral && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Subjects</label>
                <div className="space-y-2">
                  {subjects.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={selectedSubjects.includes(s.id)} onCheckedChange={() => toggleSubject(s.id)} />
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="text-sm">{s.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
