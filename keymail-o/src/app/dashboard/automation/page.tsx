"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState('schedules');
  
  // Sample data for scheduled emails
  const scheduledEmails = [
    {
      id: "1",
      name: "Birthday Wishes Campaign",
      description: "Send birthday greetings to clients",
      status: "active",
      schedule: "Runs on client's birthdate",
      lastRun: "2 days ago",
      nextRun: "Tomorrow",
      recipients: 3,
      template: "Birthday Wishes",
    },
    {
      id: "2",
      name: "Monthly Newsletter",
      description: "Send monthly real estate market updates",
      status: "active",
      schedule: "1st of every month",
      lastRun: "12 days ago",
      nextRun: "18 days from now",
      recipients: 48,
      template: "Monthly Newsletter",
    },
    {
      id: "3",
      name: "Home Anniversary Campaign",
      description: "Celebrate home purchase anniversaries",
      status: "active",
      schedule: "Runs on client's closing anniversary",
      lastRun: "5 days ago",
      nextRun: "2 days from now",
      recipients: 2,
      template: "Home Anniversary",
    },
    {
      id: "4",
      name: "Holiday Greeting",
      description: "Send holiday wishes to all clients",
      status: "draft",
      schedule: "Scheduled for December 20",
      lastRun: "Never",
      nextRun: "December 20",
      recipients: 48,
      template: "Holiday Greetings",
    },
    {
      id: "5",
      name: "Quarterly Market Update",
      description: "Send quarterly market analysis",
      status: "paused",
      schedule: "First day of each quarter",
      lastRun: "April 1",
      nextRun: "July 1",
      recipients: 48,
      template: "Quarterly Market Update",
    },
  ];

  // Sample data for automation rules
  const automationRules = [
    {
      id: "1",
      name: "Welcome Sequence",
      description: "Send a series of 3 emails to new clients",
      status: "active",
      trigger: "New client added",
      emailsSent: 15,
      lastTriggered: "Yesterday",
      createdAt: "2 months ago",
    },
    {
      id: "2",
      name: "Follow-up After Showing",
      description: "Send follow-up email 2 days after property showing",
      status: "active",
      trigger: "Property showing completed",
      emailsSent: 32,
      lastTriggered: "3 days ago",
      createdAt: "3 months ago",
    },
    {
      id: "3",
      name: "Re-engagement Campaign",
      description: "Send re-engagement email to inactive clients",
      status: "paused",
      trigger: "No activity for 60 days",
      emailsSent: 12,
      lastTriggered: "15 days ago",
      createdAt: "1 month ago",
    },
  ];

  // Render status badge
  function StatusBadge({ status }) {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
      failed: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.draft}`}>
        {status === "active" && (
          <span className="h-2 w-2 mr-1.5 rounded-full bg-green-500"></span>
        )}
        {status === "paused" && (
          <span className="h-2 w-2 mr-1.5 rounded-full bg-yellow-500"></span>
        )}
        {status === "draft" && (
          <span className="h-2 w-2 mr-1.5 rounded-full bg-gray-500"></span>
        )}
        {status === "failed" && (
          <span className="h-2 w-2 mr-1.5 rounded-full bg-red-500"></span>
        )}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule Automation</h1>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/automation/rules/new" className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              New Rule
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/automation/schedule" className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Schedule
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'schedules'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('schedules')}
            >
              Scheduled Emails
            </button>
            <button
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('rules')}
            >
              Automation Rules
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'schedules' ? (
            <div>
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Active Schedules</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {scheduledEmails.filter(email => email.status === 'active').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Paused</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {scheduledEmails.filter(email => email.status === 'paused').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Draft</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {scheduledEmails.filter(email => email.status === 'draft').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Emails This Month</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">32</p>
                </div>
              </div>

              {/* Scheduled emails table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Run
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipients
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scheduledEmails.map((email) => (
                      <tr key={email.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{email.name}</div>
                              <div className="text-sm text-gray-500">{email.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{email.schedule}</div>
                          <div className="text-sm text-gray-500">Last run: {email.lastRun}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={email.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {email.nextRun}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {email.recipients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link href={`/dashboard/automation/schedule/${email.id}`} className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </Link>
                            <button className="text-gray-600 hover:text-gray-900">
                              {email.status === 'active' ? 'Pause' : email.status === 'paused' ? 'Resume' : 'Activate'}
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              {/* Summary cards for automation rules */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Active Rules</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {automationRules.filter(rule => rule.status === 'active').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Paused Rules</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {automationRules.filter(rule => rule.status === 'paused').length}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">Total Emails Sent</h3>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {automationRules.reduce((total, rule) => total + rule.emailsSent, 0)}
                  </p>
                </div>
              </div>

              {/* Automation rules table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trigger
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emails Sent
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Triggered
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {automationRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                              <div className="text-sm text-gray-500">{rule.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{rule.trigger}</div>
                          <div className="text-sm text-gray-500">Created: {rule.createdAt}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={rule.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.emailsSent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.lastTriggered}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link href={`/dashboard/automation/rules/${rule.id}`} className="text-indigo-600 hover:text-indigo-900">
                              Edit
                            </Link>
                            <button className="text-gray-600 hover:text-gray-900">
                              {rule.status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 