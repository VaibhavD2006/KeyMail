"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Template card component
function TemplateCard({ template, onSelect }) {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect(template)}
    >
      <div className="h-48 bg-gray-50 p-4 border-b border-gray-200">
        <div className="bg-white rounded border border-gray-200 h-full p-3 text-sm text-gray-500 overflow-hidden">
          <div className="font-medium text-gray-700 mb-2">Subject: {template.subject}</div>
          <p className="line-clamp-5">{template.preview}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{template.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex px-2 py-1 text-xs rounded-md ${
              template.category === "birthday" 
                ? "bg-blue-50 text-blue-700"
                : template.category === "anniversary" 
                ? "bg-green-50 text-green-700"
                : template.category === "holiday" 
                ? "bg-red-50 text-red-700"
                : template.category === "market-update" 
                ? "bg-yellow-50 text-yellow-700"
                : template.category === "newsletter" 
                ? "bg-purple-50 text-purple-700"
                : "bg-gray-50 text-gray-700"
            }`}>
              {template.categoryLabel}
            </span>
            {template.isAI && (
              <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-indigo-50 text-indigo-700">
                AI Generated
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {template.lastModified}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Mock template data
  const templates = [
    {
      id: "1",
      name: "Birthday Wishes",
      category: "birthday",
      categoryLabel: "Birthday",
      subject: "Happy Birthday, {{first_name}}!",
      preview: "Dear {{first_name}},\n\nHappy birthday! I hope your special day is filled with joy, laughter, and all the things that make you happy. It's been a pleasure to work with you on your real estate journey.\n\nWishing you a fantastic year ahead!\n\nBest regards,\n{{agent_name}}",
      lastModified: "2 days ago",
      isAI: true,
    },
    {
      id: "2",
      name: "Home Anniversary",
      category: "anniversary",
      categoryLabel: "Anniversary",
      subject: "Happy Home Anniversary, {{first_name}}!",
      preview: "Dear {{first_name}},\n\nCan you believe it's been {{years}} since you moved into your home? Time certainly flies! I wanted to take a moment to wish you a happy home anniversary.\n\nHow are you enjoying the neighborhood? If you need any recommendations for local services or have any questions, I'm always here to help.\n\nBest wishes,\n{{agent_name}}",
      lastModified: "1 week ago",
      isAI: true,
    },
    {
      id: "3",
      name: "Quarterly Market Update",
      category: "market-update",
      categoryLabel: "Market Update",
      subject: "{{area_name}} Real Estate Market Update - Q{{quarter}} {{year}}",
      preview: "Hello {{first_name}},\n\nI hope this email finds you well. I wanted to share some insights about the real estate market in {{area_name}} for the past quarter.\n\nThe average home price has {{price_change_direction}} by {{price_change_percentage}}% to {{average_price}}. Inventory levels are {{inventory_status}}, with {{inventory_change_direction}} from last quarter.\n\nIf you have any questions about how these trends might affect your property's value, please don't hesitate to reach out.\n\nBest regards,\n{{agent_name}}",
      lastModified: "3 weeks ago",
      isAI: false,
    },
    {
      id: "4",
      name: "Holiday Greetings",
      category: "holiday",
      categoryLabel: "Holiday",
      subject: "Warm {{holiday_name}} Wishes",
      preview: "Dear {{first_name}},\n\nAs {{holiday_name}} approaches, I wanted to take a moment to extend my warmest wishes to you and your family.\n\nIt's been a pleasure to serve as your real estate agent, and I'm grateful for the trust you've placed in me.\n\nWishing you a wonderful holiday season filled with joy, peace, and happiness.\n\nWarm regards,\n{{agent_name}}",
      lastModified: "1 month ago",
      isAI: true,
    },
    {
      id: "5",
      name: "Monthly Newsletter",
      category: "newsletter",
      categoryLabel: "Newsletter",
      subject: "{{month}} Real Estate Newsletter - Tips and Insights",
      preview: "Dear {{first_name}},\n\nWelcome to this month's real estate newsletter. Here are some highlights:\n\n1. Market Trends: {{market_trend_summary}}\n2. Home Improvement Tip: {{home_improvement_tip}}\n3. Neighborhood Spotlight: {{neighborhood_spotlight}}\n\nIf you have any questions or need real estate assistance, I'm just a phone call away.\n\nBest regards,\n{{agent_name}}",
      lastModified: "2 months ago",
      isAI: false,
    },
    {
      id: "6",
      name: "New Listing Alert",
      category: "listing",
      categoryLabel: "Listing",
      subject: "New Property Alert - {{property_type}} in {{neighborhood}}",
      preview: "Hi {{first_name}},\n\nBased on your preferences, I thought you might be interested in this new listing:\n\n{{property_type}} in {{neighborhood}}\nPrice: {{price}}\nBedrooms: {{bedrooms}}\nBathrooms: {{bathrooms}}\nSq Ft: {{square_feet}}\n\nKey features: {{key_features}}\n\nWould you like to schedule a viewing? Let me know what time works best for you.\n\nBest,\n{{agent_name}}",
      lastModified: "3 months ago",
      isAI: false,
    },
  ];

  // Categories for filtering
  const categories = [
    { id: "all", label: "All Templates" },
    { id: "birthday", label: "Birthday" },
    { id: "anniversary", label: "Anniversary" },
    { id: "market-update", label: "Market Updates" },
    { id: "holiday", label: "Holiday" },
    { id: "newsletter", label: "Newsletters" },
    { id: "listing", label: "Listings" },
  ];

  // Filter templates based on search query and selected category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.preview.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (selectedCategory === "all") return true;
    return template.category === selectedCategory;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/templates/ai-generator" className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Generator
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/templates/new" className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Template
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search box */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    selectedCategory === category.id
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Template Grid */}
        <div className="p-6">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={setSelectedTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/dashboard/templates/new">
                    Create a new template
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="template-preview-modal" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedTemplate(null)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {selectedTemplate.name}
                      </h3>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/templates/${selectedTemplate.id}/edit`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Edit
                        </Link>
                        <Link 
                          href={`/dashboard/templates/${selectedTemplate.id}/use`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Use Template
                        </Link>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Category: <span className="font-medium">{selectedTemplate.categoryLabel}</span></p>
                        <p className="text-sm text-gray-500">Last Modified: <span className="font-medium">{selectedTemplate.lastModified}</span></p>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 mb-4">
                        <p className="text-sm font-medium text-gray-900">Subject: {selectedTemplate.subject}</p>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 h-64 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTemplate.preview}</pre>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Variables:</span> {{first_name}}, {{agent_name}}, and others specific to template type
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse">
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 