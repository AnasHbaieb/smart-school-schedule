import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppDataProvider } from "@/contexts/AppDataContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PasswordGate } from "@/components/PasswordGate";
import Dashboard from "@/pages/Dashboard";
import TimetablePage from "@/pages/TimetablePage";
import TeachersPage from "@/pages/TeachersPage";
import SubjectsPage from "@/pages/SubjectsPage";
import ClassroomsPage from "@/pages/ClassroomsPage";
import GroupsPage from "@/pages/GroupsPage";
import SlotsPage from "@/pages/SlotsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AppDataProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/timetable" element={<TimetablePage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/classrooms" element={<ClassroomsPage />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/slots" element={<SlotsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppDataProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
