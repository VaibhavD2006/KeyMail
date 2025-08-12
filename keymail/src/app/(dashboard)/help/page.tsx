"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your API in a real implementation
    console.log("Support request submitted:", { supportName, supportEmail, supportMessage });
    // Show a success message
    alert("Your support request has been submitted. We'll get back to you soon!");
    // Reset form
    setSupportName("");
    setSupportEmail("");
    setSupportMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>

        {/* Search */}
        <div className="w-full">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <Tabs defaultValue="faqs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about KeyMail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg mb-2">How do I import my existing clients?</h3>
                    <p className="text-gray-600">
                      KeyMail supports importing clients from CSV files or directly from popular CRM systems. Go to Clients, click on the "Import" button, and follow the instructions to map your data fields.
                    </p>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg mb-2">Can I customize email templates?</h3>
                    <p className="text-gray-600">
                      Yes, KeyMail provides a variety of customizable email templates. Navigate to the Emails section, select "Templates," and either edit an existing template or create a new one from scratch using our drag-and-drop editor.
                    </p>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg mb-2">How do I schedule recurring emails?</h3>
                    <p className="text-gray-600">
                      To set up recurring emails, create a new campaign in the Emails section, select your recipients, choose your template, and then set the frequency in the schedule options (daily, weekly, monthly, etc.).
                    </p>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg mb-2">Is my data secure?</h3>
                    <p className="text-gray-600">
                      KeyMail takes data security seriously. We use industry-standard encryption, regular security audits, and strict access controls to protect your data. For more details, please review our Security Policy in the footer of our website.
                    </p>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium text-lg mb-2">How do I export my analytics data?</h3>
                    <p className="text-gray-600">
                      You can export analytics data in CSV or PDF format. Navigate to the Analytics page, filter the data as needed, and click the "Download Report" button at the top right corner of the page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorials">
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step guides to get the most out of KeyMail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-100 aspect-video flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Getting Started with KeyMail</h3>
                      <p className="text-sm text-gray-500 mt-1">Learn the basics of setting up your account and managing clients</p>
                      <Button variant="outline" className="mt-3 w-full">Watch Now</Button>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-100 aspect-video flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Creating Effective Email Campaigns</h3>
                      <p className="text-sm text-gray-500 mt-1">Tips and techniques for crafting engaging real estate emails</p>
                      <Button variant="outline" className="mt-3 w-full">Watch Now</Button>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-100 aspect-video flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Understanding Analytics</h3>
                      <p className="text-sm text-gray-500 mt-1">How to interpret and act on email performance metrics</p>
                      <Button variant="outline" className="mt-3 w-full">Watch Now</Button>
                    </div>
                  </div>

                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-100 aspect-video flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">Advanced Segmentation</h3>
                      <p className="text-sm text-gray-500 mt-1">Targeting the right clients with personalized messaging</p>
                      <Button variant="outline" className="mt-3 w-full">Watch Now</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need help with something specific? Our team is here to assist you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                    <Input 
                      id="name"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <Input 
                      id="email"
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">How can we help?</label>
                    <Textarea 
                      id="message"
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe your issue or question in detail"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 w-full"
                  >
                    Submit Request
                  </Button>
                </form>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Other Ways to Reach Us</h3>
                  <div className="space-y-2">
                    <p className="text-sm flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      support@keymail.com
                    </p>
                    <p className="text-sm flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      (555) 123-4567
                    </p>
                    <p className="text-sm flex items-center">
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Monday-Friday, 9am-5pm EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 