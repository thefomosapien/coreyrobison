import Sidebar from '@/components/admin/Sidebar';
import { ToastProvider } from '@/components/admin/Toast';

export const metadata = {
  title: 'Admin — Corey Robison',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <Sidebar />
        <main className="lg:ml-60 min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
