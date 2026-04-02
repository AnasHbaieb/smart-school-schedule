export type Lang = 'en' | 'ar';

const translations = {
  // App
  appName: { en: 'SmartTimetable', ar: 'الجدول الذكي' },
  lightMode: { en: 'Light Mode', ar: 'الوضع الفاتح' },
  darkMode: { en: 'Dark Mode', ar: 'الوضع الداكن' },

  // Nav
  navDashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  navTimetable: { en: 'Timetable', ar: 'الجدول الزمني' },
  navTeachers: { en: 'Teachers', ar: 'الأساتذة' },
  navSubjects: { en: 'Subjects', ar: 'المواد' },
  navClassrooms: { en: 'Classrooms', ar: 'القاعات' },
  navStudentGroups: { en: 'Student Groups', ar: 'الأفواج' },
  navTimeSlots: { en: 'Time Slots', ar: 'الحصص الزمنية' },

  // Dashboard
  dashboardTitle: { en: 'Dashboard', ar: 'لوحة التحكم' },
  dashboardSubtitle: { en: 'Welcome to SmartTimetable — manage your school schedule.', ar: 'مرحبًا بك في الجدول الذكي — قم بإدارة جدول مدرستك.' },
  teachers: { en: 'Teachers', ar: 'الأساتذة' },
  classrooms: { en: 'Classrooms', ar: 'القاعات' },
  studentGroups: { en: 'Student Groups', ar: 'الأفواج' },
  subjects: { en: 'Subjects', ar: 'المواد' },
  timeSlots: { en: 'Time Slots', ar: 'الحصص الزمنية' },
  scheduledLessons: { en: 'Scheduled Lessons', ar: 'الحصص المجدولة' },
  totalLessonsScheduled: { en: 'Total lessons scheduled this week', ar: 'إجمالي الحصص المجدولة هذا الأسبوع' },
  conflicts: { en: 'Conflicts', ar: 'التعارضات' },
  conflictsDetected: { en: 'Scheduling conflicts detected!', ar: 'تم اكتشاف تعارضات في الجدول!' },
  noConflicts: { en: 'No scheduling conflicts detected', ar: 'لا توجد تعارضات' },
  coverage: { en: 'Coverage', ar: 'التغطية' },
  requiredHoursFilled: { en: 'required hours filled', ar: 'ساعات مطلوبة مكتملة' },
  loadingData: { en: 'Loading data...', ar: 'جاري تحميل البيانات...' },

  // Timetable
  weeklyTimetable: { en: 'Weekly Timetable', ar: 'الجدول الأسبوعي' },
  timetableSubtitle: { en: 'View and manage the weekly schedule grid.', ar: 'عرض وإدارة شبكة الجدول الأسبوعي.' },
  clear: { en: 'Clear', ar: 'مسح' },
  autoSchedule: { en: 'Auto Schedule', ar: 'جدولة تلقائية' },
  allGroups: { en: 'All Groups', ar: 'كل الأفواج' },
  allTeachers: { en: 'All Teachers', ar: 'كل الأساتذة' },
  studentGroup: { en: 'Student Group', ar: 'الفوج' },
  teacher: { en: 'Teacher', ar: 'الأستاذ' },
  time: { en: 'Time', ar: 'الوقت' },
  noTimeSlotsConfigured: { en: 'No time slots configured. Add time slots first.', ar: 'لا توجد حصص زمنية. أضف حصصًا زمنية أولاً.' },

  // Teachers page
  teachersTitle: { en: 'Teachers', ar: 'الأساتذة' },
  teachersSubtitle: { en: 'Manage teaching staff and their subjects.', ar: 'إدارة الطاقم التدريسي وموادهم.' },
  addTeacher: { en: 'Add Teacher', ar: 'إضافة أستاذ' },
  editTeacher: { en: 'Edit Teacher', ar: 'تعديل أستاذ' },
  allTeachersList: { en: 'All Teachers', ar: 'كل الأساتذة' },
  name: { en: 'Name', ar: 'الاسم' },
  subject: { en: 'Subject', ar: 'المادة' },
  hoursPerWeek: { en: 'Hours/Week', ar: 'ساعات/أسبوع' },
  grade: { en: 'Grade', ar: 'المستوى' },
  section: { en: 'Section', ar: 'القسم' },
  actions: { en: 'Actions', ar: 'الإجراءات' },
  noTeachersYet: { en: 'No teachers yet.', ar: 'لا يوجد أساتذة بعد.' },
  gradeAndSection: { en: 'Grade (column) & Section (column)', ar: 'المستوى والقسم' },
  pickGradeAndSection: { en: 'Pick grade and section', ar: 'اختر المستوى والقسم' },
  alreadyAdded: { en: 'Already added', ar: 'مضاف مسبقًا' },
  fillAllFields: { en: 'Please fill all fields', ar: 'يرجى ملء جميع الحقول' },
  addAtLeastOneSection: { en: 'Add at least one grade/section', ar: 'أضف مستوى/قسم واحد على الأقل' },
  teacherUpdated: { en: 'Teacher updated', ar: 'تم تحديث الأستاذ' },
  teacherAdded: { en: 'Teacher added', ar: 'تم إضافة الأستاذ' },
  teacherDeleted: { en: 'Teacher deleted', ar: 'تم حذف الأستاذ' },

  // Subjects page
  subjectsTitle: { en: 'Subjects', ar: 'المواد' },
  subjectsSubtitle: { en: 'Manage subjects and their colors.', ar: 'إدارة المواد وألوانها.' },
  addSubject: { en: 'Add Subject', ar: 'إضافة مادة' },
  editSubject: { en: 'Edit Subject', ar: 'تعديل مادة' },
  allSubjects: { en: 'All Subjects', ar: 'كل المواد' },
  title: { en: 'Title', ar: 'العنوان' },
  color: { en: 'Color', ar: 'اللون' },
  noSubjectsYet: { en: 'No subjects yet.', ar: 'لا توجد مواد بعد.' },
  enterTitle: { en: 'Please enter a title', ar: 'يرجى إدخال عنوان' },
  subjectUpdated: { en: 'Subject updated', ar: 'تم تحديث المادة' },
  subjectAdded: { en: 'Subject added', ar: 'تم إضافة المادة' },
  subjectDeleted: { en: 'Subject deleted', ar: 'تم حذف المادة' },

  // Classrooms page
  classroomsTitle: { en: 'Classrooms', ar: 'القاعات' },
  classroomsSubtitle: { en: 'Manage rooms and their assigned subjects.', ar: 'إدارة القاعات والمواد المخصصة لها.' },
  addClassroom: { en: 'Add Classroom', ar: 'إضافة قاعة' },
  editClassroom: { en: 'Edit Classroom', ar: 'تعديل قاعة' },
  allClassrooms: { en: 'All Classrooms', ar: 'كل القاعات' },
  all: { en: 'All', ar: 'الكل' },
  type: { en: 'Type', ar: 'النوع' },
  regular: { en: 'Regular (All subjects)', ar: 'عادية (كل المواد)' },
  specialized: { en: 'Specialized', ar: 'متخصصة' },
  selectSubjects: { en: 'Select Subjects', ar: 'اختر المواد' },
  noClassroomsYet: { en: 'No classrooms yet.', ar: 'لا توجد قاعات بعد.' },
  enterName: { en: 'Please enter a name', ar: 'يرجى إدخال اسم' },
  selectAtLeastOneSubject: { en: 'Select at least one subject', ar: 'اختر مادة واحدة على الأقل' },
  classroomUpdated: { en: 'Classroom updated', ar: 'تم تحديث القاعة' },
  classroomAdded: { en: 'Classroom added', ar: 'تم إضافة القاعة' },
  classroomDeleted: { en: 'Classroom deleted', ar: 'تم حذف القاعة' },

  // Groups page
  groupsTitle: { en: 'Student Groups', ar: 'الأفواج' },
  groupsSubtitle: { en: 'Manage grades, sections, and their subject allocations.', ar: 'إدارة المستويات والأقسام وتوزيع المواد.' },
  addGroup: { en: 'Add Group', ar: 'إضافة فوج' },
  editGroup: { en: 'Edit Student Group', ar: 'تعديل فوج' },
  allGroupsList: { en: 'All Groups', ar: 'كل الأفواج' },
  className: { en: 'Class', ar: 'الصف' },
  subjectsAndHours: { en: 'Subjects & Hours/Week', ar: 'المواد والساعات/أسبوع' },
  noGroupsYet: { en: 'No groups yet.', ar: 'لا توجد أفواج بعد.' },
  fillGradeAndSection: { en: 'Please fill grade and section', ar: 'يرجى ملء المستوى والقسم' },
  addAtLeastOneSubjectHours: { en: 'Add at least one subject with hours', ar: 'أضف مادة واحدة على الأقل مع الساعات' },
  groupUpdated: { en: 'Group updated', ar: 'تم تحديث الفوج' },
  groupAdded: { en: 'Group added', ar: 'تم إضافة الفوج' },
  groupDeleted: { en: 'Group deleted', ar: 'تم حذف الفوج' },
  addSubjectsFirst: { en: 'Add subjects first to assign hours.', ar: 'أضف المواد أولاً لتحديد الساعات.' },

  // Slots page
  slotsTitle: { en: 'Time Slots', ar: 'الحصص الزمنية' },
  slotsSubtitle: { en: 'Configure daily lesson periods and their active days.', ar: 'تكوين فترات الحصص اليومية وأيامها النشطة.' },
  addSlot: { en: 'Add Slot', ar: 'إضافة حصة' },
  editSlot: { en: 'Edit Time Slot', ar: 'تعديل حصة زمنية' },
  dailySchedule: { en: 'Daily Schedule', ar: 'الجدول اليومي' },
  periods: { en: 'periods', ar: 'فترات' },
  lunchBreak: { en: 'Lunch Break', ar: 'استراحة الغداء' },
  days: { en: 'days', ar: 'أيام' },
  startTime: { en: 'Start Time', ar: 'وقت البدء' },
  endTime: { en: 'End Time', ar: 'وقت الانتهاء' },
  activeDays: { en: 'Active Days', ar: 'الأيام النشطة' },
  noSlotsYet: { en: 'No time slots yet. Click "Add Slot" to create one.', ar: 'لا توجد حصص زمنية. انقر "إضافة حصة" لإنشاء واحدة.' },
  fillBothTimes: { en: 'Please fill both times', ar: 'يرجى ملء كلا الوقتين' },
  startBeforeEnd: { en: 'Start must be before end', ar: 'يجب أن يكون وقت البدء قبل الانتهاء' },
  selectAtLeastOneDay: { en: 'Select at least one day', ar: 'اختر يومًا واحدًا على الأقل' },
  slotUpdated: { en: 'Time slot updated', ar: 'تم تحديث الحصة الزمنية' },
  slotAdded: { en: 'Time slot added', ar: 'تم إضافة الحصة الزمنية' },
  slotDeleted: { en: 'Time slot deleted', ar: 'تم حذف الحصة الزمنية' },

  // Common
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  add: { en: 'Add', ar: 'إضافة' },
  update: { en: 'Update', ar: 'تحديث' },
  delete: { en: 'Delete', ar: 'حذف' },
  edit: { en: 'Edit', ar: 'تعديل' },

  // Days
  monday: { en: 'Monday', ar: 'الإثنين' },
  tuesday: { en: 'Tuesday', ar: 'الثلاثاء' },
  wednesday: { en: 'Wednesday', ar: 'الأربعاء' },
  thursday: { en: 'Thursday', ar: 'الخميس' },
  friday: { en: 'Friday', ar: 'الجمعة' },
  saturday: { en: 'Saturday', ar: 'السبت' },

  // Day shorts
  mon: { en: 'Mon', ar: 'إث' },
  tue: { en: 'Tue', ar: 'ثل' },
  wed: { en: 'Wed', ar: 'أر' },
  thu: { en: 'Thu', ar: 'خم' },
  fri: { en: 'Fri', ar: 'جم' },
  sat: { en: 'Sat', ar: 'سب' },

  // Timetable messages
  timetableCleared: { en: 'Timetable cleared', ar: 'تم مسح الجدول' },
  autoScheduled: { en: 'Auto-scheduled', ar: 'تمت الجدولة التلقائية' },
  lessons: { en: 'lessons', ar: 'حصص' },
} as const;

export type TranslationKey = keyof typeof translations;

export default translations;
