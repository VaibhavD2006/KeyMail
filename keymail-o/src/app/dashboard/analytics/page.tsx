"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  
  // Mock analytics data
  const analyticsData = {
    summary: {
      totalSent: 1042,
      openRate: 38.4,
      clickRate: 12.7,
      responseRate: 5.2,
      bounceRate: 1.8,
      unsubscribeRate: 0.3,
    },
    campaigns: [
      {
        id: "1",
        name: "Monthly Newsletter - June",
        sentDate: "Jun 1, 2023",
        sent: 210,
        opened: 134,
        clicked: 48,
        responses: 12,
        bounced: 3,
        unsubscribed: 1,
      },
      {
        id: "2",
        name: "New Listing Alert",
        sentDate: "Jun 15, 2023",
        sent: 45,
        opened: 38,
        clicked: 22,
        responses: 7,
        bounced: 0,
        unsubscribed: 0,
      },
      {
        id: "3",
        name: "Market Update - Q2",
        sentDate: "Jul 2, 2023",
        sent: 187,
        opened: 95,
        clicked: 34,
        responses: 8,
        bounced: 2,
        unsubscribed: 0,
      },
      {
        id: "4",
        name: "Client Birthdays - July",
        sentDate: "Jul 10, 2023",
        sent: 15,
        opened: 13,
        clicked: 2,
        responses: 5,
        bounced: 0,
        unsubscribed: 0,
      },
      {
        id: "5",
        name: "Home Anniversary - July",
        sentDate: "Jul 15, 2023",
        sent: 18,
        opened: 16,
        clicked: 4,
        responses: 3,
        bounced: 0,
        unsubscribed: 0,
      },
    ],
    topPerforming: {
      openRate: "Client Birthdays - July",
      clickRate: "New Listing Alert",
      responseRate: "Client Birthdays - July",
    },
    deviceBreakdown: {
      mobile: 62,
      desktop: 34,
      tablet: 4,
    },
    openTimeDistribution: {
      morning: 31,
      afternoon: 42,
      evening: 19,
      night: 8,
    },
  };

  // Helper function for percentage calculation
  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
  };

  // Card component for metric display
  function MetricCard({ title, value, subValue, color = "indigo" }) {
    const colorClasses = {
      indigo: "text-indigo-600",
      green: "text-green-600",
      blue: "text-blue-600",
      purple: "text-purple-600",
      red: "text-red-600",
      yellow: "text-yellow-600",
    };
    
    return (
      <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className={`mt-1 text-2xl font-semibold ${colorClasses[color] || colorClasses.indigo}`}>
          {value}
        </p>
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
      </div>
    );
  }

  // Chart bar component (simulating a chart)
  function ChartBar({ label, percentage, value, color = "bg-indigo-500" }) {
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${color} h-2.5 rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  }

  // Donut chart component (simulating a chart with CSS)
  function DonutChart({ data, title }) {
    // Calculate accumulated percentages for CSS conic gradient
    let cumulativePercentage = 0;
    const conicSections = Object.entries(data).map(([key, value]) => {
      const startPercentage = cumulativePercentage;
      cumulativePercentage += value;
      return {
        key,
        value,
        startPercentage,
        endPercentage: cumulativePercentage,
      };
    });

    // Generate the conic gradient CSS
    const generateConicGradient = () => {
      let gradient = "conic-gradient(";
      const colors = {
        mobile: "#6366f1",
        desktop: "#a855f7",
        tablet: "#ec4899",
        morning: "#6366f1",
        afternoon: "#a855f7",
        evening: "#ec4899",
        night: "#8b5cf6",
      };

      conicSections.forEach((section, index) => {
        const startAngle = section.startPercentage * 3.6; // 3.6 degrees per percentage
        const endAngle = section.endPercentage * 3.6;
        gradient += `${colors[section.key]} ${startAngle}deg ${endAngle}deg${index < conicSections.length - 1 ? "," : ""}`;
      });
      gradient += ")";

      return gradient;
    };

    return (
      <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
        
        <div className="flex flex-col items-center mb-4">
          <div 
            className="w-32 h-32 rounded-full" 
            style={{ background: generateConicGradient() }}
          >
            <div className="w-20 h-20 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ 
                  backgroundColor: key === "mobile" || key === "morning" ? "#6366f1" : 
                                 key === "desktop" || key === "afternoon" ? "#a855f7" : 
                                 key === "evening" ? "#ec4899" : "#8b5cf6" 
                }}
              ></div>
              <span className="text-xs text-gray-700 capitalize">{key}: {value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === '7days' ? "default" : "outline"}
            onClick={() => setTimeRange('7days')}
            className="text-sm"
          >
            7 Days
          </Button>
          <Button 
            variant={timeRange === '30days' ? "default" : "outline"}
            onClick={() => setTimeRange('30days')}
            className="text-sm"
          >
            30 Days
          </Button>
          <Button 
            variant={timeRange === '90days' ? "default" : "outline"}
            onClick={() => setTimeRange('90days')}
            className="text-sm"
          >
            90 Days
          </Button>
          <Button 
            variant={timeRange === 'year' ? "default" : "outline"}
            onClick={() => setTimeRange('year')}
            className="text-sm"
          >
            Year
          </Button>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard 
          title="Total Emails Sent" 
          value={analyticsData.summary.totalSent} 
          subValue="Last 90 days" 
          color="indigo"
        />
        <MetricCard 
          title="Open Rate" 
          value={`${analyticsData.summary.openRate}%`} 
          subValue={`Industry avg: 21.5%`} 
          color="green"
        />
        <MetricCard 
          title="Click Rate" 
          value={`${analyticsData.summary.clickRate}%`} 
          subValue={`Industry avg: 7.8%`} 
          color="blue"
        />
        <MetricCard 
          title="Response Rate" 
          value={`${analyticsData.summary.responseRate}%`} 
          subValue={`Industry avg: 3.1%`} 
          color="purple"
        />
        <MetricCard 
          title="Bounce Rate" 
          value={`${analyticsData.summary.bounceRate}%`} 
          subValue={`Industry avg: 2.0%`} 
          color="red"
        />
        <MetricCard 
          title="Unsubscribe Rate" 
          value={`${analyticsData.summary.unsubscribeRate}%`} 
          subValue={`Industry avg: 0.5%`} 
          color="yellow"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-5 border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Campaign Performance</h3>
              <Button variant="outline" size="sm">Download Report</Button>
            </div>
            
            {/* Recent campaigns table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Open Rate
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Click Rate
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-xs text-gray-500">{campaign.sentDate}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.sent}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {calculatePercentage(campaign.opened, campaign.sent)}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${(campaign.opened / campaign.sent) * 100}%` }}></div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {calculatePercentage(campaign.clicked, campaign.sent)}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${(campaign.clicked / campaign.sent) * 100}%` }}></div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {calculatePercentage(campaign.responses, campaign.sent)}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full" 
                            style={{ width: `${(campaign.responses / campaign.sent) * 100}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-6">
            {/* Top performing */}
            <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Top Performing Campaigns</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Highest Open Rate</span>
                    <span className="text-xs font-medium text-gray-700">86.7%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{analyticsData.topPerforming.openRate}</p>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Highest Click Rate</span>
                    <span className="text-xs font-medium text-gray-700">48.9%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{analyticsData.topPerforming.clickRate}</p>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Highest Response Rate</span>
                    <span className="text-xs font-medium text-gray-700">33.3%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">{analyticsData.topPerforming.responseRate}</p>
                </div>
              </div>
            </div>
            
            {/* Device breakdown */}
            <DonutChart 
              data={analyticsData.deviceBreakdown} 
              title="Device Breakdown"
            />
            
            {/* Open time distribution */}
            <DonutChart 
              data={analyticsData.openTimeDistribution} 
              title="Open Time Distribution"
            />
          </div>
        </div>
      </div>
      
      {/* Weekly engagement */}
      <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Weekly Engagement Overview</h3>
        
        <div className="space-y-3">
          <ChartBar 
            label="Opens" 
            percentage={analyticsData.summary.openRate} 
            value={`${analyticsData.summary.openRate}%`} 
            color="bg-green-500"
          />
          <ChartBar 
            label="Clicks" 
            percentage={analyticsData.summary.clickRate} 
            value={`${analyticsData.summary.clickRate}%`} 
            color="bg-blue-500"
          />
          <ChartBar 
            label="Responses" 
            percentage={analyticsData.summary.responseRate} 
            value={`${analyticsData.summary.responseRate}%`} 
            color="bg-purple-500"
          />
          <ChartBar 
            label="Bounces" 
            percentage={analyticsData.summary.bounceRate} 
            value={`${analyticsData.summary.bounceRate}%`} 
            color="bg-red-500"
          />
          <ChartBar 
            label="Unsubscribes" 
            percentage={analyticsData.summary.unsubscribeRate} 
            value={`${analyticsData.summary.unsubscribeRate}%`} 
            color="bg-yellow-500"
          />
        </div>
      </div>
    </div>
  );
} 