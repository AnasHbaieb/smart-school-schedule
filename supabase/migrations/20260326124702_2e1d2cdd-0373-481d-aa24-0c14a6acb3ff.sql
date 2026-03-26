
-- Subjects table (no weekly_hours)
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'hsl(243 75% 59%)',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert subjects" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update subjects" ON public.subjects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete subjects" ON public.subjects FOR DELETE USING (true);

-- Teachers table (sections as text array for multiple grade/sections)
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  hours_per_week INTEGER NOT NULL DEFAULT 18,
  sections TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Allow public insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update teachers" ON public.teachers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete teachers" ON public.teachers FOR DELETE USING (true);

-- Classrooms table
CREATE TABLE public.classrooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject_ids UUID[] NOT NULL DEFAULT '{}',
  is_general BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read classrooms" ON public.classrooms FOR SELECT USING (true);
CREATE POLICY "Allow public insert classrooms" ON public.classrooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update classrooms" ON public.classrooms FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete classrooms" ON public.classrooms FOR DELETE USING (true);

-- Student groups table (with class_name)
CREATE TABLE public.student_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  class_name TEXT NOT NULL DEFAULT '',
  subjects JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read student_groups" ON public.student_groups FOR SELECT USING (true);
CREATE POLICY "Allow public insert student_groups" ON public.student_groups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update student_groups" ON public.student_groups FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete student_groups" ON public.student_groups FOR DELETE USING (true);

-- Time slots table (with days array)
CREATE TABLE public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  days TEXT[] NOT NULL DEFAULT '{Monday,Tuesday,Wednesday,Thursday,Friday,Saturday}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read time_slots" ON public.time_slots FOR SELECT USING (true);
CREATE POLICY "Allow public insert time_slots" ON public.time_slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update time_slots" ON public.time_slots FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete time_slots" ON public.time_slots FOR DELETE USING (true);

-- Timetable entries
CREATE TABLE public.timetable_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  time_slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE NOT NULL,
  day_of_week TEXT NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE NOT NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  student_group_id UUID REFERENCES public.student_groups(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(time_slot_id, day_of_week, teacher_id),
  UNIQUE(time_slot_id, day_of_week, classroom_id),
  UNIQUE(time_slot_id, day_of_week, student_group_id)
);
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read timetable_entries" ON public.timetable_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert timetable_entries" ON public.timetable_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update timetable_entries" ON public.timetable_entries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete timetable_entries" ON public.timetable_entries FOR DELETE USING (true);
