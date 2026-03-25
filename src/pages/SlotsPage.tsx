import { mockLessonSlots } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import { DAYS } from '@/types/timetable';

export default function SlotsPage() {
  // Get unique time ranges
  const uniqueTimes = Array.from(
    new Set(mockLessonSlots.map(s => `${s.start_time}-${s.end_time}`))
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Slots</h1>
          <p className="text-muted-foreground mt-1">Configure daily lesson periods.</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Slot</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Daily Schedule ({uniqueTimes.length} periods)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {uniqueTimes.map((t, i) => {
              const [start, end] = t.split('-');
              const isBreak = start === '12:20' || start === '14:00';
              return (
                <div key={t}>
                  {isBreak && start === '14:00' && (
                    <div className="flex items-center gap-3 py-2 text-sm text-accent font-medium">
                      <div className="h-px flex-1 bg-accent/30" />
                      Lunch Break
                      <div className="h-px flex-1 bg-accent/30" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <span className="text-sm font-bold text-primary w-8">P{i + 1}</span>
                    <span className="text-sm font-medium">{start}</span>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span className="text-sm font-medium">{end}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {DAYS.length} days
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
