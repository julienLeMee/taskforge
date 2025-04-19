import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:pl-64 pt-16">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
