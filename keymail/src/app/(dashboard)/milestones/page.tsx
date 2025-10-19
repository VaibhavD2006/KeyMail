"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Gift, Home, Cake, Clock } from "lucide-react";

interface Milestone {
  id: string;
  clientId: string;
  type: "home_anniversary" | "birthday" | "personal_event" | "closing";
  title: string;
  date: string;
  message?: string;
  lastSent?: string;
  nextSendDate: string;
  isActive: boolean;
  client?: {
    name: string;
    email: string;
  };
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/milestones");
      
      if (!response.ok) {
        throw new Error("Failed to fetch milestones");
      }
      
      const data = await response.json();
      setMilestones(data.data || []);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      setError("Failed to load milestones");
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case "home_anniversary":
        return <Home className="h-4 w-4" />;
      case "birthday":
        return <Cake className="h-4 w-4" />;
      case "closing":
        return <Gift className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getMilestoneTypeLabel = (type: string) => {
    switch (type) {
      case "home_anniversary":
        return "Home Anniversary";
      case "birthday":
        return "Birthday";
      case "closing":
        return "Closing";
      case "personal_event":
        return "Personal Event";
      default:
        return type;
    }
  };

  const getMilestoneTypeColor = (type: string) => {
    switch (type) {
      case "home_anniversary":
        return "bg-blue-100 text-blue-800";
      case "birthday":
        return "bg-pink-100 text-pink-800";
      case "closing":
        return "bg-green-100 text-green-800";
      case "personal_event":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days`;
  };

  const getUpcomingMilestones = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return milestones
      .filter(milestone => {
        const nextDate = new Date(milestone.nextSendDate);
        nextDate.setHours(0, 0, 0, 0);
        return nextDate >= today && milestone.isActive;
      })
      .sort((a, b) => new Date(a.nextSendDate).getTime() - new Date(b.nextSendDate).getTime())
      .slice(0, 5);
  };

  const getOverdueMilestones = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return milestones.filter(milestone => {
      const nextDate = new Date(milestone.nextSendDate);
      nextDate.setHours(0, 0, 0, 0);
      return nextDate < today && milestone.isActive;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading milestones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchMilestones}>Try Again</Button>
        </div>
      </div>
    );
  }

  const upcomingMilestones = getUpcomingMilestones();
  const overdueMilestones = getOverdueMilestones();

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Milestones</h1>
          <p className="text-gray-600 mt-2">
            Manage client milestones and automated celebrations
          </p>
        </div>
        <Link href="/milestones/create">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Milestones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milestones.length}</div>
            <p className="text-xs text-muted-foreground">
              {milestones.filter(m => m.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMilestones.length}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueMilestones.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {milestones.filter(m => {
                const nextDate = new Date(m.nextSendDate);
                const now = new Date();
                return nextDate.getMonth() === now.getMonth() && 
                       nextDate.getFullYear() === now.getFullYear() &&
                       m.isActive;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Due this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Milestones */}
      {overdueMilestones.length > 0 && (
        <Card className="mb-8 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Overdue Milestones ({overdueMilestones.length})
            </CardTitle>
            <CardDescription>
              These milestones are past due and need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getMilestoneIcon(milestone.type)}
                    <div>
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-gray-600">
                        Due: {formatDate(milestone.nextSendDate)} ({getDaysUntil(milestone.nextSendDate)})
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                    Send Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Milestones</CardTitle>
          <CardDescription>
            Milestones scheduled for the next 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMilestones.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming milestones</h3>
              <p className="text-gray-600 mb-4">
                Create milestones to automatically celebrate with your clients
              </p>
              <Link href="/milestones/create">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Milestone
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                      {getMilestoneIcon(milestone.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getMilestoneTypeColor(milestone.type)}>
                          {getMilestoneTypeLabel(milestone.type)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {getDaysUntil(milestone.nextSendDate)}
                        </span>
                      </div>
                      {milestone.message && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Send Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

