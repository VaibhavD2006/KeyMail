'use client'

import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white py-4 w-full">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-purple-600">{siteConfig.name}</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/testimonials"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Testimonials
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white bg-purple-600 px-5 py-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center mx-auto leading-tight">
            Automate Your Real Estate<br />Client Relationships
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Keep your clients engaged with AI-powered personalized emails. Build 
            stronger relationships, save time, and never miss an important touchpoint.
          </p>
          <p className="mt-3 text-gray-500 italic">
            (Made for Realtors by a Realtor)
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-purple-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Start Free Trial →
            </Link>
            <p className="text-sm text-gray-500">No credit card required</p>
          </div>
          
          <div className="mt-16 relative">
            <div className="w-full max-w-6xl mx-auto rounded-xl shadow-xl overflow-hidden">
              {/* Placeholder for dashboard image */}
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                <img 
                  src="/dashboard-screenshot.png" 
                  alt="KeyMail Dashboard" 
                  className="w-full h-auto"
                  onError={(e) => {
                    // Fallback if image doesn't load
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18c94140ee8%20text%20%7B%20fill%3A%23C4C4C4%3Bfont-weight%3Anormal%3Bfont-family%3A%27Inter%27%2C%20sans-serif%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18c94140ee8%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23F3F4F6%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22245%22%3EApplication%20Screenshot%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Key Features
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to maintain strong client relationships
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
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
              <h3 className="text-xl font-bold">Client Management</h3>
              <p className="text-center text-gray-500">
                Easily add and manage client profiles with key details and relationship context.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
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
              <h3 className="text-xl font-bold">AI Email Generation</h3>
              <p className="text-center text-gray-500">
                Create personalized email templates for various occasions with AI assistance.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
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
              <h3 className="text-xl font-bold">Approval System</h3>
              <p className="text-center text-gray-500">
                Review and approve emails before sending to maintain quality control.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
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
              <h3 className="text-xl font-bold">Email Integration</h3>
              <p className="text-center text-gray-500">
                Connect with popular email services like Gmail, Outlook, and Mailchimp.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
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
              <h3 className="text-xl font-bold">Scheduling</h3>
              <p className="text-center text-gray-500">
                Schedule emails for automated sending at the perfect time.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 shadow-sm">
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
              <h3 className="text-xl font-bold">Analytics</h3>
              <p className="text-center text-gray-500">
                Track email performance with detailed analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Grow Your Real Estate Business?
              </h2>
              <p className="max-w-[600px] mx-auto text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of real estate agents who are building stronger client relationships with KeyMail.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              >
                Get Started for Free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-md border border-blue-500 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-300"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="/terms"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
