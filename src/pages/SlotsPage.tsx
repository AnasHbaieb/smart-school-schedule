import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { useLang } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Clock, Pencil, Trash2 } from 'lucide-react';
import { DAYS, DayOfWeek } from '@/types/timetable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { TranslationKey } from '@/i18n/translations';

const DAY_KEY_MAP: Record<DayOfWeek, TranslationKey> = {
  Monday: 'monday', Tuesday: 'tuesday', Wednesday: 'wednesday',
  Thursday: 'thursday', Friday: 'friday', Saturday: 'saturday',
};

const DAY_SHORT_KEY_MAP: Record<DayOfWeek, TranslationKey> = {
  Monday: 'mon', Tuesday: 'tue', Wednesday: 'wed',
  Thursday: 'thu', Friday: 'fri', Saturday: 'sat',
};

export default function SlotsPage() {
  const { timeSlotDefs, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useData();
  const { t } = useLang();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([...DAYS]);

  const openAdd = () => { setEditId(null); setStart(''); setEnd(''); setSelectedDays([...DAYS]); setDialogOpen(true); };

  const openEdit = (id: string) => {
    const slot = timeSlotDefs.find(t => t.id === id);
    if (!slot) return;
    setEditId(id); setStart(slot.start_time); setEnd(slot.end_time); setSelectedDays([...slot.days]);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!start || !end) { toast.error(t('fillBothTimes')); return; }
    if (start >= end) { toast.error(t('startBeforeEnd')); return; }
    if (selectedDays.length === 0) { toast.error(t('selectAtLeastOneDay')); return; }
    if (editId) { updateTimeSlot(editId, { start_time: start, end_time: end, days: selectedDays }); toast.success(t('slotUpdated')); }
    else { addTimeSlot({ start_time: start, end_time: end, days: selectedDays }); toast.success(t('slotAdded')); }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => { deleteTimeSlot(id); toast.success(t('slotDeleted')); };
  const toggleDay = (day: DayOfWeek) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('slotsTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('slotsSubtitle')}</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> {t('addSlot')}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t('dailySchedule')} ({timeSlotDefs.length} {t('periods')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeSlotDefs.map((slot, i) => {
              const isLunchBefore = i > 0 && timeSlotDefs[i - 1].end_time <= '13:05' && slot.start_time >= '14:00';
              return (
                <div key={slot.id}>
                  {isLunchBefore && (
                    <div className="flex items-center gap-3 py-2 text-sm text-accent font-medium">
                      <div className="h-px flex-1 bg-accent/30" />
                      {t('lunchBreak')}
                      <div className="h-px flex-1 bg-accent/30" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <span className="text-sm font-bold text-primary w-8">P{i + 1}</span>
                    <span className="text-sm font-medium">{slot.start_time}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-sm font-medium">{slot.end_time}</span>
                    <div className="flex gap-1 ml-2">
                      {DAYS.map(day => (
                        <span
                          key={day}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            slot.days.includes(day)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {t(DAY_SHORT_KEY_MAP[day])}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {slot.days.length} {t('days')}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(slot.id)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(slot.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            {timeSlotDefs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">{t('noSlotsYet')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? t('editSlot') : t('addSlot')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('startTime')}</label>
                <Input type="time" value={start} onChange={e => setStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('endTime')}</label>
                <Input type="time" value={end} onChange={e => setEnd(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('activeDays')}</label>
              <div className="flex flex-wrap gap-3">
                {DAYS.map(day => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={selectedDays.includes(day)} onCheckedChange={() => toggleDay(day)} />
                    <span className="text-sm">{t(DAY_KEY_MAP[day])}</span>
                  </label>
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
