import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { useLang } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, GraduationCap, Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function GroupsPage() {
  const { studentGroups, subjects, addStudentGroup, updateStudentGroup, deleteStudentGroup, getSubjectById } = useData();
  const { t } = useLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [className, setClassName] = useState('');
  const [subjectHours, setSubjectHours] = useState<{ subject_id: string; hours_per_week: number }[]>([]);

  const openAdd = () => {
    setEditId(null); setGrade(''); setSection(''); setClassName('');
    setSubjectHours(subjects.map(s => ({ subject_id: s.id, hours_per_week: 0 })));
    setDialogOpen(true);
  };
  const openEdit = (id: string) => {
    const g = studentGroups.find(x => x.id === id);
    if (!g) return;
    setEditId(id); setGrade(g.grade); setSection(g.section); setClassName(g.class_name);
    setSubjectHours(subjects.map(s => {
      const existing = g.subjects.find(gs => gs.subject_id === s.id);
      return { subject_id: s.id, hours_per_week: existing?.hours_per_week || 0 };
    }));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!grade || !section) { toast.error(t('fillGradeAndSection')); return; }
    const activeSubjects = subjectHours.filter(s => s.hours_per_week > 0);
    if (activeSubjects.length === 0) { toast.error(t('addAtLeastOneSubjectHours')); return; }
    const data = { grade, section, class_name: className, subjects: activeSubjects };
    if (editId) { updateStudentGroup(editId, data); toast.success(t('groupUpdated')); }
    else { addStudentGroup(data); toast.success(t('groupAdded')); }
    setDialogOpen(false);
  };

  const setHoursForSubject = (subjectId: string, hours: number) => {
    setSubjectHours(prev => prev.map(s => s.subject_id === subjectId ? { ...s, hours_per_week: hours } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('groupsTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('groupsSubtitle')}</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> {t('addGroup')}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            {t('allGroupsList')} ({studentGroups.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('grade')}</TableHead>
                <TableHead>{t('section')}</TableHead>
                <TableHead>{t('className')}</TableHead>
                <TableHead>{t('subjects')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentGroups.map(g => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{t('grade')} {g.grade}</TableCell>
                  <TableCell>{t('section')} {g.section}</TableCell>
                  <TableCell>{g.class_name || '—'}</TableCell>
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
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { deleteStudentGroup(g.id); toast.success(t('groupDeleted')); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {studentGroups.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">{t('noGroupsYet')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? t('editGroup') : t('addGroup')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><label className="text-sm font-medium">{t('grade')}</label><Input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. 1er" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">{t('section')}</label><Input value={section} onChange={e => setSection(e.target.value)} placeholder="e.g. Science" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">{t('className')}</label><Input value={className} onChange={e => setClassName(e.target.value)} placeholder="e.g. 1" /></div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('subjectsAndHours')}</label>
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
                {subjectHours.length === 0 && (
                  <p className="text-sm text-muted-foreground">{t('addSubjectsFirst')}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
            <Button onClick={handleSave}>{editId ? t('update') : t('add')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
