import { NavLink, useLocation } from 'react-router-dom';
import {
  Calendar, Users, BookOpen, DoorOpen, GraduationCap,
  LayoutDashboard, Moon, Sun, Clock, Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLang } from '@/contexts/LanguageContext';

export function AppSidebar() {
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
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground min-h-screen">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Calendar className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {t('appName')}
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <Languages className="w-4 h-4" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? t('lightMode') : t('darkMode')}
        </Button>
      </div>
    </aside>
  );
}
