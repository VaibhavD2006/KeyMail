"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
              Download Report
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Filter Data
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
              <p className="text-xs text-green-500 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Email Opens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">76.2%</div>
              <p className="text-xs text-green-500 mt-1">+3.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Click Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24.8%</div>
              <p className="text-xs text-green-500 mt-1">+2.4% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1.2 days</div>
              <p className="text-xs text-red-500 mt-1">+0.3 days from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Content */}
        <Tabs defaultValue="engagement" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="clients">Client Growth</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Email Engagement</CardTitle>
                <CardDescription>Email opens, clicks, and responses over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chart Placeholder */}
                <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Email Engagement Chart Visualization</p>
                </div>
                
                {/* Top Performing Emails */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Top Performing Emails</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Spring Listings Update</span>
                        <span className="text-green-500">92% open rate</span>
                      </div>
                      <p className="text-sm text-gray-500">Sent April 15, 2024 to 45 clients</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Market Trends: Q2 2024</span>
                        <span className="text-green-500">88% open rate</span>
                      </div>
                      <p className="text-sm text-gray-500">Sent May 2, 2024 to 112 clients</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Neighborhood Spotlight: Downtown</span>
                        <span className="text-green-500">85% open rate</span>
                      </div>
                      <p className="text-sm text-gray-500">Sent April 28, 2024 to 67 clients</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Acquisition and Retention</CardTitle>
                <CardDescription>Growth and engagement patterns of your client base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chart Placeholder */}
                <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Client Growth Chart Visualization</p>
                </div>
                
                {/* Client Segments */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Client Segments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Prospects</h4>
                      <div className="text-2xl font-bold">42</div>
                      <p className="text-xs text-gray-500 mt-1">32.8% of total clients</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Active Clients</h4>
                      <div className="text-2xl font-bold">53</div>
                      <p className="text-xs text-gray-500 mt-1">41.4% of total clients</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Past Clients</h4>
                      <div className="text-2xl font-bold">33</div>
                      <p className="text-xs text-gray-500 mt-1">25.8% of total clients</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Results from your email campaigns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Chart Placeholder */}
                <div className="h-80 w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Campaign Performance Visualization</p>
                </div>
                
                {/* Recent Campaigns */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Recent Campaigns</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">New Listings Alert</span>
                        <span className="text-green-500">Active</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Started May 5, 2024 • 112 recipients</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-bold">78%</div>
                          <div className="text-xs text-gray-500">Open Rate</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-bold">23%</div>
                          <div className="text-xs text-gray-500">Click Rate</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-bold">12</div>
                          <div className="text-xs text-gray-500">Responses</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Spring Home Maintenance Tips</span>
                        <span className="text-gray-500">Completed</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">April 10-20, 2024 • 98 recipients</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-sm">
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-bold">82%</div>
                          <div className="text-xs text-gray-500">Open Rate</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-bold">31%</div>
                          <div className="text-xs text-gray-500">Click Rate</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                          <div className="font-bold">18</div>
                          <div className="text-xs text-gray-500">Responses</div>
                        </div>
                      </div>
                    </div>
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