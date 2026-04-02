import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, Menu, X, Users, BookOpen, DoorOpen, GraduationCap, LayoutDashboard, Clock, Moon, Sun, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLang } from '@/contexts/LanguageContext';

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const { t, lang, toggle: toggleLang } = useLang();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('navDashboard') },
    { to: '/timetable', icon: Calendar, label: t('navTimetable') },
    { to: '/teachers', icon: Users, label: t('navTeachers') },
    { to: '/subjects', icon: BookOpen, label: t('navSubjects') },
    { to: '/classrooms', icon: DoorOpen, label: t('navClassrooms') },
    { to: '/groups', icon: GraduationCap, label: t('navStudentGroups') },
    { to: '/slots', icon: Clock, label: t('navTimeSlots') },
  ];

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span className="font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{t('appName')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleLang} className="text-primary-foreground hover:bg-primary/80">
            <Languages className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} className="text-primary-foreground hover:bg-primary/80">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="text-primary-foreground hover:bg-primary/80">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="bg-card border-b border-border px-3 py-2 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      )}
    </div>
  );
}
