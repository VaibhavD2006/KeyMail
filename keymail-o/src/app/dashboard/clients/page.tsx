"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Mock client data
  const clients = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 123-4567",
      birthday: "1985-06-15",
      closingAnniversary: "2021-04-10",
      lastContact: "2023-03-01",
      tags: ["Buyer", "First-time"],
      relationshipLevel: "Warm",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@example.com",
      phone: "(555) 234-5678",
      birthday: "1978-09-22",
      closingAnniversary: "2022-07-15",
      lastContact: "2023-02-28",
      tags: ["Seller", "Investor"],
      relationshipLevel: "Hot",
    },
    {
      id: "3",
      name: "Jessica Rodriguez",
      email: "jessica.r@example.com",
      phone: "(555) 345-6789",
      birthday: "1990-03-12",
      closingAnniversary: "2020-11-05",
      lastContact: "2023-02-15",
      tags: ["Buyer", "Seller", "Repeat"],
      relationshipLevel: "Cold",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david.wilson@example.com",
      phone: "(555) 456-7890",
      birthday: "1982-11-30",
      closingAnniversary: "2021-09-20",
      lastContact: "2023-01-10",
      tags: ["Seller", "Luxury"],
      relationshipLevel: "Warm",
    },
    {
      id: "5",
      name: "Emily Lee",
      email: "emily.lee@example.com",
      phone: "(555) 567-8901",
      birthday: "1988-02-14",
      closingAnniversary: "2022-03-28",
      lastContact: "2023-02-20",
      tags: ["Buyer", "Relocation"],
      relationshipLevel: "Hot",
    },
  ];

  // Filter clients based on search query and active filter
  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);
      
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case "hot":
        return client.relationshipLevel === "Hot";
      case "warm":
        return client.relationshipLevel === "Warm";
      case "cold":
        return client.relationshipLevel === "Cold";
      default:
        return true;
    }
  });

  // Filter options
  const filters = [
    { id: "all", label: "All Clients" },
    { id: "hot", label: "Hot Leads" },
    { id: "warm", label: "Warm Leads" },
    { id: "cold", label: "Cold Leads" },
  ];

  // Format date to more readable form
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days since last contact
  const daysSinceContact = (dateString: string) => {
    const lastContact = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastContact.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Client Database</h1>
        <Button asChild>
          <Link href="/dashboard/clients/add" className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Client
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search box */}
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search clients..."
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

            {/* Filters */}
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeFilter === filter.id
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Client list */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact Info
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Important Dates
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tags
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">{client.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            client.relationshipLevel === "Hot" 
                              ? "bg-green-100 text-green-800"
                              : client.relationshipLevel === "Warm"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {client.relationshipLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                    <div className="text-sm text-gray-500">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Birthday: {formatDate(client.birthday)}</div>
                    <div className="text-sm text-gray-500">Closing: {formatDate(client.closingAnniversary)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(client.lastContact)}</div>
                    <div className="text-sm text-gray-500">{daysSinceContact(client.lastContact)} days ago</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/clients/${client.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - simplified for this example */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredClients.length}</span> of <span className="font-medium">{filteredClients.length}</span> clients
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 