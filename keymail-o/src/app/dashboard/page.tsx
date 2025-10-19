"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

function StatCard({ title, value, icon: Icon, color }: 
  { title: string; value: string | number; icon: React.ComponentType<any>; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex">
      <div className={`rounded-full h-12 w-12 flex items-center justify-center ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-gray-800 font-medium">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function ActivityItem({ 
  title, 
  description, 
  time, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  description: string; 
  time: string; 
  icon: React.ComponentType<any>; 
  color: string;
}) {
  return (
    <div className="flex space-x-3 pb-4">
      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-500 whitespace-nowrap">
        {time}
      </div>
    </div>
  );
}

// Icons
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Placeholder chart for email performance
  const EmailPerformanceChart = () => (
    <div className="h-64 flex items-center justify-center">
      <div className="flex space-x-3 items-end">
        <div className="h-32 w-10 bg-purple-200 rounded-t-md relative group">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Monday: 78%
          </div>
        </div>
        <div className="h-40 w-10 bg-purple-400 rounded-t-md relative group">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Tuesday: 92%
          </div>
        </div>
        <div className="h-28 w-10 bg-purple-300 rounded-t-md relative group">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Wednesday: 65%
          </div>
        </div>
        <div className="h-36 w-10 bg-purple-400 rounded-t-md relative group">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Thursday: 84%
          </div>
        </div>
        <div className="h-44 w-10 bg-purple-500 rounded-t-md relative group">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Friday: 98%
          </div>
        </div>
        <div className="h-24 w-10 bg-purple-200 rounded-t-md relative group">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Saturday: 56%
          </div>
        </div>
        <div className="h-20 w-10 bg-purple-100 rounded-t-md relative group">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Sunday: 48%
          </div>
        </div>
      </div>
    </div>
  );

  // Mock data for recent activity
  const recentActivity = [
    {
      title: "New Client Added",
      description: "You added Sarah Johnson to your client database",
      time: "2h ago",
      icon: UsersIcon,
      color: "bg-green-500",
    },
    {
      title: "Email Sent",
      description: "Birthday wishes email sent to Michael Chen",
      time: "5h ago",
      icon: MailIcon,
      color: "bg-blue-500",
    },
    {
      title: "Campaign Scheduled",
      description: "Market update campaign scheduled for next Tuesday",
      time: "Yesterday",
      icon: CalendarIcon,
      color: "bg-purple-500",
    },
    {
      title: "New Template Created",
      description: "You created a new email template: 'Home Anniversary'",
      time: "2 days ago",
      icon: MailIcon,
      color: "bg-yellow-500",
    },
    {
      title: "Analytics Report",
      description: "Monthly engagement report is now available",
      time: "3 days ago",
      icon: ChartIcon,
      color: "bg-indigo-500",
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: "Add Client",
      href: "/dashboard/clients/add",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Create Email",
      href: "/dashboard/templates/new",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Schedule Campaign",
      href: "/dashboard/automation/schedule",
      color: "bg-green-600 hover:bg-green-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Welcome message */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}</h1>
              <div className="flex space-x-3">
                {quickActions.map((action, i) => (
                  <Link 
                    key={i}
                    href={action.href}
                    className={`${action.color} text-white py-2 px-4 rounded-md flex items-center space-x-1`}
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>{action.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Clients" 
                value={48} 
                icon={UsersIcon} 
                color="bg-purple-600" 
              />
              <StatCard 
                title="Active Campaigns" 
                value={3} 
                icon={CalendarIcon} 
                color="bg-blue-600" 
              />
              <StatCard 
                title="Emails Sent (This Month)" 
                value={157} 
                icon={MailIcon} 
                color="bg-green-600" 
              />
              <StatCard 
                title="Open Rate" 
                value="78%" 
                icon={ChartIcon} 
                color="bg-yellow-600" 
              />
            </div>

            {/* Charts and activity row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Email Performance (Last 7 Days)">
                <EmailPerformanceChart />
              </ChartCard>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-gray-800 font-medium">Recent Activity</h3>
                </div>
                <div className="p-6 space-y-4 divide-y divide-gray-100">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className={i > 0 ? 'pt-4' : ''}>
                      <ActivityItem {...activity} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-gray-800 font-medium">Upcoming Events</h3>
              </div>
              <div className="p-6">
                <div className="bg-purple-50 p-4 rounded-md border border-purple-100 flex items-start">
                  <div className="bg-purple-100 rounded-md p-2 mr-4">
                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Client Birthday Reminders</h4>
                    <p className="text-sm text-gray-600 mt-1">3 clients have birthdays coming up in the next 7 days</p>
                    <div className="mt-2">
                      <Link href="/dashboard/clients?filter=upcoming_birthdays" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        View Clients →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 