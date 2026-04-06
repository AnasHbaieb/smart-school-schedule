import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { useLang } from '@/contexts/LanguageContext';
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
  const { teachers, subjects, studentGroups, addTeacher, updateTeacher, deleteTeacher, getSubjectById } = useData();
  const { t } = useLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [hours, setHours] = useState('');
  const [sections, setSections] = useState<string[]>([]);
  const [gradePick, setGradePick] = useState('');
  const [sectionPick, setSectionPick] = useState('');
  const [sectionInput, setSectionInput] = useState('');

  const normalizeSectionPair = (raw: string): { grade?: string; section?: string; raw: string } => {
    const s = raw.trim();
    if (!s) return { raw: '' };
    if (s.includes(':')) {
      const [g, sec] = s.split(':');
      return { grade: g?.trim() || undefined, section: sec?.trim() || undefined, raw: s };
    }
    const m = s.match(/(\d+)\s*[- ]?\s*([A-Za-z].*)$/);
    if (m) return { grade: m[1], section: m[2].trim(), raw: s };
    return { raw: s };
  };

  const gradeOptions = Array.from(new Set(studentGroups.map(g => g.grade))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const sectionOptions = Array.from(new Set(studentGroups.filter(g => !gradePick || g.grade === gradePick).map(g => g.section)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const openAdd = () => {
    setEditId(null); setName(''); setSubjectId(subjects[0]?.id || ''); setHours('');
    setSections([]); setGradePick(''); setSectionPick(''); setSectionInput('');
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const teacher = teachers.find(x => x.id === id);
    if (!teacher) return;
    setEditId(id); setName(teacher.name); setSubjectId(teacher.subject_id);
    setHours(String(teacher.hours_per_week)); setSections([...teacher.sections]);
    setGradePick(''); setSectionPick(''); setSectionInput('');
    setDialogOpen(true);
  };

  const addSection = () => {
    if (studentGroups.length > 0) {
      if (!gradePick || !sectionPick) { toast.error(t('pickGradeAndSection')); return; }
      const val = `${gradePick}:${sectionPick}`;
      if (sections.includes(val)) { toast.error(t('alreadyAdded')); return; }
      setSections(prev => [...prev, val]);
      setSectionPick('');
      return;
    }
    const val = sectionInput.trim();
    if (!val) return;
    if (sections.includes(val)) { toast.error(t('alreadyAdded')); return; }
    setSections(prev => [...prev, val]);
    setSectionInput('');
  };

  const removeSection = (s: string) => setSections(prev => prev.filter(x => x !== s));

  const handleSave = () => {
    if (!name || !subjectId || !hours) { toast.error(t('fillAllFields')); return; }
    if (sections.length === 0) { toast.error(t('addAtLeastOneSection')); return; }
    const data = { name, subject_id: subjectId, hours_per_week: parseInt(hours), sections };
    if (editId) { updateTeacher(editId, data); toast.success(t('teacherUpdated')); }
    else { addTeacher(data); toast.success(t('teacherAdded')); }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('teachersTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('teachersSubtitle')}</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> {t('addTeacher')}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t('allTeachersList')} ({teachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('subject')}</TableHead>
                <TableHead>{t('hoursPerWeek')}</TableHead>
                <TableHead>{t('classSection')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map(teacher => {
                const subject = getSubjectById(teacher.subject_id);
                const pairs = teacher.sections.map(normalizeSectionPair).filter(p => p.raw);
                return (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: subject?.color }}>
                        {subject?.title}
                      </span>
                    </TableCell>
                    <TableCell>{teacher.hours_per_week}h</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {pairs.map((p, idx) => (
                          <Badge key={`${teacher.id}_c_${p.raw}_${idx}`} variant="secondary" className="text-xs">
                            {p.grade && p.section ? `${t('grade')} ${p.grade} ${p.section}` : p.raw}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(teacher.id)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { deleteTeacher(teacher.id); toast.success(t('teacherDeleted')); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {teachers.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">{t('noTeachersYet')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? t('editTeacher') : t('addTeacher')}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><label className="text-sm font-medium">{t('name')}</label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('subject')}</label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium">{t('hoursPerWeek')}</label><Input type="number" value={hours} onChange={e => setHours(e.target.value)} /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('gradeAndSection')}</label>
              {studentGroups.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  <Select value={gradePick} onValueChange={(v) => { setGradePick(v); setSectionPick(''); }}>
                    <SelectTrigger><SelectValue placeholder={t('grade')} /></SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map(g => <SelectItem key={g} value={g}>{t('grade')} {g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={sectionPick} onValueChange={setSectionPick}>
                    <SelectTrigger><SelectValue placeholder={t('section')} /></SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" onClick={addSection}>{t('add')}</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input value={sectionInput} onChange={e => setSectionInput(e.target.value)} placeholder="e.g. 10A" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSection())} />
                  <Button type="button" variant="outline" onClick={addSection}>{t('add')}</Button>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {sections.map(s => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {(() => {
                      const p = normalizeSectionPair(s);
                      if (p.grade && p.section) return `${t('grade')} ${p.grade} ${p.section}`;
                      return s;
                    })()}
                    <button onClick={() => removeSection(s)}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
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
