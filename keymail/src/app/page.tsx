'use client'

import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 py-4 w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <span className="text-lg font-bold text-purple-600">K</span>
            </div>
            <span className="text-2xl font-bold text-white">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Contact us
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg transition-colors"
            >
              Try now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen bg-gray-900 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content - Moved further left for more text space */}
            <div className="space-y-8 lg:-ml-16 xl:-ml-50">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-5xl">
                <span className="text-white">Meet <span className="text-purple-400">KeyMail</span></span>
                <br /> <span className="text-white">The </span>
                <span className="text-purple-400">AI Email platfrom</span>
                <br />
                <span className="text-white">Made for <span className="text-purple-400">Realtors</span></span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
                Built for real estate agents, teams, and agencies to organically grow their client relationships — on autopilot.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg font-semibold text-white transition-colors shadow-lg shadow-purple-600/25"
                >
                  Get started
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-600 bg-transparent hover:bg-gray-800 px-8 py-4 text-lg font-semibold text-white transition-colors"
                >
                  Get a demo
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-gray-900"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-400 border-2 border-gray-900"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-300 border-2 border-gray-900"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-200 border-2 border-gray-900"></div>
                </div>
                <p className="text-gray-400">
                  Join <span className="text-purple-400 font-semibold">1,200+</span> agents now
                </p>
              </div>
            </div>
            
            {/* Right Content - Dashboard Preview - Kept in current position */}
            <div className="relative">
              {/* Top Right Dashboard - Client Management */}
              <div className="absolute -top-36 -right-30 z-20 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 shadow-2xl w-72">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-400">Client Hub</div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-2">
                    <div className="text-purple-400 font-semibold text-xs">Active Clients</div>
                    <div className="text-white text-lg font-bold">24</div>
                  </div>
                  <div className="bg-gray-600/30 rounded-lg p-2">
                    <div className="text-gray-300 text-xs">Last Contact</div>
                    <div className="text-white text-sm">2 days ago</div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-400">KeyMail Dashboard</div>
                </div>
                
                {/* Dashboard Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Engagement Queue Panel */}
                  <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">Engagement Queue</h3>
                      <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-400">i</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs mb-4">Scroll to view suggestions from this session</p>
                    
                    <div className="space-y-3">
                      <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
                        <div className="text-purple-400 font-semibold text-sm">5 suggestions</div>
                      </div>
                      <div className="bg-gray-600/50 border border-gray-500/30 rounded-lg p-3">
                        <div className="text-gray-300 font-semibold text-sm">0 posting</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-600/30 rounded-lg">
                      <div className="text-white text-sm font-medium">Sarah Johnson @sarahjohnson</div>
                      <div className="text-gray-400 text-xs">11:56 PM · Mar 27, 2025</div>
                    </div>
                  </div>
                  
                  {/* Session Overview Panel */}
                  <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold text-sm">Session Overview</h3>
                      <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg transition-colors">
                        Stop session
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-400">Started Mar 28, 2025, 1:40 AM</div>
                      <div className="text-gray-400">Search term: <span className="text-purple-400">real estate agents building relationships</span></div>
                      <div className="text-gray-400">Time elapsed: <span className="text-purple-400">1:32</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Right Dashboard - Email Analytics */}
              <div className="absolute -bottom-28 -right-30 z-20 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 shadow-2xl w-72">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-400">Email Stats</div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2">
                    <div className="text-green-400 font-semibold text-xs">Open Rate</div>
                    <div className="text-white text-lg font-bold">87%</div>
                  </div>
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2">
                    <div className="text-blue-400 text-xs">Response Rate</div>
                    <div className="text-white text-sm">23%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seamless gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gray-900 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"></div>
        </div>
        
        {/* Seamless gradient transition from hero */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Key Features
              </h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to maintain strong client relationships
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Client Management</h3>
              <p className="text-center text-gray-300">
                Easily add and manage client profiles with key details and relationship context.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg">
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">AI Email Generation</h3>
              <p className="text-center text-gray-300">
                Create personalized email templates for various occasions with AI assistance.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg">
              <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Approval System</h3>
              <p className="text-center text-gray-300">
                Review and approve emails before sending to maintain quality control.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg">
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Email Integration</h3>
              <p className="text-center text-gray-300">
                Connect with popular email services like Gmail, Outlook, and Mailchimp.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg">
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Scheduling</h3>
              <p className="text-center text-gray-300">
                Schedule emails for automated sending at the perfect time.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Analytics</h3>
              <p className="text-center text-gray-300">
                Track email performance with detailed analytics and insights.
              </p>
            </div>
          </div>
        </div>
        
        {/* Seamless gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gray-800 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Seamless gradient transition from features */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Grow Your Real Estate Business?
              </h2>
              <p className="max-w-[600px] mx-auto text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of real estate agents who are building stronger client relationships with KeyMail.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 hover:bg-purple-700 px-8 text-sm font-medium text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-600"
              >
                Get Started for Free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-md border border-purple-500 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-300"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
        
        {/* Seamless gradient transition to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent"></div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0 bg-gray-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-400 md:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/terms"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
