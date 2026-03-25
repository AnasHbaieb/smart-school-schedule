import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { MobileHeader } from './MobileHeader';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
