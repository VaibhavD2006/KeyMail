"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/date-range-picker";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Calendar */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Date</CardTitle>
              <CardDescription>Select a date to view or add events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Events for selected date */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>
                Events for {date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardTitle>
              <CardDescription>Manage your schedule and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample events */}
                <div className="p-4 border rounded-md bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Client Meeting: John Smith</h3>
                      <p className="text-sm text-gray-500">10:00 AM - 11:00 AM</p>
                      <p className="text-sm mt-2">Discuss property requirements and budget</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Meeting</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Property Viewing: 123 Main St</h3>
                      <p className="text-sm text-gray-500">2:00 PM - 3:30 PM</p>
                      <p className="text-sm mt-2">Show Jane Doe the beachfront property</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Viewing</span>
                  </div>
                </div>
                
                <div className="p-4 border rounded-md bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Send Follow-up Emails</h3>
                      <p className="text-sm text-gray-500">4:00 PM - 5:00 PM</p>
                      <p className="text-sm mt-2">Follow up with leads from weekend open house</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Task</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 