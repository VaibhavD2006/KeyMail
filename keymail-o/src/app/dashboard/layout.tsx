import { ReactNode } from "react";
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Server-side authentication check
  const session = await getServerSession();
  
  if (!session) {
    // Redirect to login if not authenticated
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar userSession={session} />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 