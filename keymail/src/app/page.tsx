'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 py-4 w-full"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-purple-600">K</span>
              </div>
              <span className="text-2xl font-bold text-white">{siteConfig.name}</span>
            </Link>
          </motion.div>
          <motion.nav
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="hidden md:flex items-center space-x-8"
          >
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
          </motion.nav>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex items-center space-x-4"
          >
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
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen bg-gray-900 overflow-hidden">
        {/* Background decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
        </motion.div>
        
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content - Moved further left for more text space */}
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
              className="space-y-8 lg:-ml-16 xl:-ml-50"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.4, ease: "easeOut" }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-5xl"
              >
                <span className="text-white">Meet <span className="text-purple-400">KeyMail</span></span>
                <br /> <span className="text-white">The </span>
                <span className="text-purple-400">AI Email platfrom</span>
                <br />
                <span className="text-white">Made for <span className="text-purple-400">Realtors</span></span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
                className="text-xl text-gray-300 max-w-3xl leading-relaxed"
              >
                Built for real estate agents, teams, and agencies to organically grow their client relationships — on autopilot.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
                className="flex flex-col sm:flex-row items-start gap-4"
              >
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
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.0, ease: "easeOut" }}
                className="flex items-center space-x-4 pt-4"
              >
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-gray-900"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-400 border-2 border-gray-900"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-300 border-2 border-gray-900"></div>
                  <div className="w-10 h-10 rounded-full bg-purple-200 border-2 border-gray-900"></div>
                </div>
                <p className="text-gray-400">
                  Join <span className="text-purple-400 font-semibold">1,200+</span> agents now
                </p>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Dashboard Preview - Kept in current position */}
            <motion.div 
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
              className="relative"
            >
              {/* Top Right Dashboard - Client Management */}
              <motion.div 
                initial={{ opacity: 0, y: -50, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
                className="absolute -top-36 -right-30 z-20 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 shadow-2xl w-72"
              >
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
              </motion.div>

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
              <motion.div 
                initial={{ opacity: 0, y: 50, x: 50 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
                className="absolute -bottom-28 -right-30 z-20 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 shadow-2xl w-72"
              >
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
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Seamless gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gray-900 overflow-hidden">
        {/* Background decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl"></div>
        </motion.div>
        
        {/* Seamless gradient transition from hero */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Key Features
              </h2>
              <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to maintain strong client relationships
              </p>
            </div>
          </motion.div>
          <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Client Management</h3>
              <p className="text-center text-gray-300">
                Complete client database with real estate preferences, milestone tracking, and relationship management.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
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
                GPT-4 powered email creation with customizable templates, tone, and personalization options.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
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
              <h3 className="text-xl font-bold text-white">MLS Email Builder</h3>
              <p className="text-center text-gray-300">
                One-click MLS property email generation with client selection and AI-powered content creation.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
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
              <h3 className="text-xl font-bold text-white">AI Buyer Match Engine</h3>
              <p className="text-center text-gray-300">
                Intelligent client-property matching with scoring algorithms and automated bulk email outreach.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
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
              <h3 className="text-xl font-bold text-white">Milestone Automation</h3>
              <p className="text-center text-gray-300">
                Automated birthday, anniversary, and closing date emails with personalized messaging and scheduling.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
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
              <h3 className="text-xl font-bold text-white">Showing Management</h3>
              <p className="text-center text-gray-300">
                Complete showing lifecycle management with automated follow-ups and feedback collection.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
              <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
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
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">MLS Listings</h3>
              <p className="text-center text-gray-300">
                Comprehensive property listing management with search, filtering, and detailed property information.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
              <div className="rounded-full bg-pink-100 p-3 text-pink-600">
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
              <h3 className="text-xl font-bold text-white">Email Templates</h3>
              <p className="text-center text-gray-300">
                Reusable email template library with AI generation, editing, and categorization by occasion.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-lg"
            >
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
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
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Analytics Dashboard</h3>
              <p className="text-center text-gray-300">
                Comprehensive analytics with email performance, client engagement, and business metrics tracking.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Seamless gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gray-800 overflow-hidden">
        {/* Background decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute inset-0"
        >
          <div className="absolute top-10 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl"></div>
        </motion.div>
        
        {/* Seamless gradient transition from features */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Upper Section - Landing Page Elements */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-300 mb-4"
            >
              Your personal AI that thinks and works like a real estate relationship expert.
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
            >
              Are you ready to <span className="text-purple-400">level up</span>?
            </motion.h2>
            
            {/* Interactive Elements */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            >
              <motion.input
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                type="email"
                placeholder="name@email.com"
                className="px-6 py-4 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[300px]"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="px-8 py-4 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                Let's gooo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.button>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="px-10 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Get started now
            </motion.button>
          </motion.div>
          
          {/* Lower Section - Application Interface Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto"
          >
            {/* Application Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-50 px-6 py-4 border-b border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500">KeyMail Dashboard</div>
              </div>
            </motion.div>
            
            <div className="flex">
              {/* Left Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
                className="w-64 bg-gray-50 p-6 border-r border-gray-200"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">KeyMail</span>
                </div>
                
                <nav className="space-y-6">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                  </motion.div>
                  
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</div>
                  
                  <motion.div 
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>Engage</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3 text-gray-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Compose</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">Coming soon</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-3 text-gray-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Schedule</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">Coming soon</span>
                  </motion.div>
                </nav>
              </motion.div>
              
              {/* Main Content Area */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                viewport={{ once: true }}
                className="flex-1 p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Engagement Queue Panel */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-gray-900 font-semibold text-sm">Engagement Queue</h3>
                      <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">i</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs mb-4">Scroll to view suggestions from this session</p>
                    
                    <div className="flex space-x-2 mb-4">
                      <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                        7 suggestions
                      </div>
                      <div className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold">
                        2 posting
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-900">Sarah Johnson</span>
                        <span className="text-blue-500">✓</span>
                        <span className="text-gray-500">@sarahjohnson</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        "Just closed on our dream home! Thank you for making this process so smooth. The milestone emails kept us informed every step of the way."
                      </p>
                      <span className="text-gray-500 text-xs">8:50 AM · Mar 28, 2025</span>
                    </div>
                  </motion.div>
                  
                  {/* Session Overview Panel */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-gray-900 font-semibold text-sm">Session Overview</h3>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                      >
                        Stop session
                      </motion.button>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-600">Started Mar 28, 2025, 3:14 PM</div>
                      <div className="text-gray-600">Search term: <span className="text-purple-600 font-semibold">real estate agents building relationships</span></div>
                      <div className="text-gray-600">Time elapsed: <span className="text-purple-600 font-semibold">3:27</span></div>
                    </div>
                  </motion.div>
                </div>
                
                {/* KeyMail's Computer Panel */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-900 font-semibold text-sm">KeyMail's Computer:</h3>
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Active</span>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="ml-4 text-sm text-gray-600">https://keymail.app/dashboard</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-gray-700 font-medium">Dashboard</span>
                        <span className="text-gray-500">Clients</span>
                        <span className="text-gray-500">Milestones</span>
                        <span className="text-gray-500">Matches</span>
                        <span className="text-gray-500">Showings</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="bg-purple-50 p-3 rounded-lg border border-purple-200"
                        >
                          <div className="text-purple-800 font-semibold text-sm">Active Clients</div>
                          <div className="text-2xl font-bold text-purple-900">24</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                        >
                          <div className="text-blue-800 font-semibold text-sm">Upcoming Milestones</div>
                          <div className="text-2xl font-bold text-blue-900">7</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="bg-green-50 p-3 rounded-lg border border-green-200"
                        >
                          <div className="text-green-800 font-semibold text-sm">New Matches</div>
                          <div className="text-2xl font-bold text-green-900">12</div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Seamless gradient transition to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent"></div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="border-t py-6 md:py-0 bg-gray-900 text-white"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center text-sm leading-loose text-gray-400 md:text-left"
          >
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4"
          >
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/terms"
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                Terms
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/privacy"
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                Privacy
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                Contact
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
