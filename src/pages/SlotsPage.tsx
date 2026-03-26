import { useState } from 'react';
import { useData } from '@/contexts/AppDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Clock, Pencil, Trash2 } from 'lucide-react';
import { DAYS } from '@/types/timetable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function SlotsPage() {
  const { timeSlotDefs, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const openAdd = () => {
    setEditIndex(null);
    setStart('');
    setEnd('');
    setDialogOpen(true);
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setStart(timeSlotDefs[index].start);
    setEnd(timeSlotDefs[index].end);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!start || !end) { toast.error('Please fill both times'); return; }
    if (start >= end) { toast.error('Start must be before end'); return; }
    if (editIndex !== null) {
      updateTimeSlot(editIndex, { start, end });
      toast.success('Time slot updated');
    } else {
      addTimeSlot({ start, end });
      toast.success('Time slot added');
    }
    setDialogOpen(false);
  };

  const handleDelete = (index: number) => {
    deleteTimeSlot(index);
    toast.success('Time slot deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Slots</h1>
          <p className="text-muted-foreground mt-1">Configure daily lesson periods.</p>
        </div>
        <Button className="gap-2" onClick={openAdd}><Plus className="w-4 h-4" /> Add Slot</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Daily Schedule ({timeSlotDefs.length} periods)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeSlotDefs.map((t, i) => {
              const isLunchBefore = i > 0 && timeSlotDefs[i - 1].end <= '13:05' && t.start >= '14:00';
              return (
                <div key={`${t.start}-${t.end}`}>
                  {isLunchBefore && (
                    <div className="flex items-center gap-3 py-2 text-sm text-accent font-medium">
                      <div className="h-px flex-1 bg-accent/30" />
                      Lunch Break
                      <div className="h-px flex-1 bg-accent/30" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <span className="text-sm font-bold text-primary w-8">P{i + 1}</span>
                    <span className="text-sm font-medium">{t.start}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-sm font-medium">{t.end}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {DAYS.length} days
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(i)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(i)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? 'Edit Time Slot' : 'Add Time Slot'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input type="time" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input type="time" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editIndex !== null ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
