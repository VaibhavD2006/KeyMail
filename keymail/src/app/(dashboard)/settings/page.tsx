"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [company, setCompany] = useState("Acme Realty");
  const [bio, setBio] = useState("Real estate agent with 10 years of experience in residential properties.");
  const [notifyEmails, setNotifyEmails] = useState(true);
  const [notifyResponses, setNotifyResponses] = useState(true);
  const [notifyClients, setNotifyClients] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  
  const handleSaveProfile = () => {
    // This would connect to your API in a real implementation
    console.log("Profile saved:", { name, email, company, bio });
    // Show a success message
    alert("Profile updated successfully!");
  };
  
  const handleSaveNotifications = () => {
    // This would connect to your API in a real implementation
    console.log("Notification preferences saved:", { 
      notifyEmails, notifyResponses, notifyClients, weeklyDigest 
    });
    // Show a success message
    alert("Notification preferences updated successfully!");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and how you appear to clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    This information may be shown to clients in your emails.
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account details and subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Subscription</h3>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Professional Plan</h4>
                        <p className="text-sm text-gray-500">Unlimited clients, advanced analytics, and AI features</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Active</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <span>Renews on July 1, 2024</span>
                      <Button variant="outline" size="sm">
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Danger Zone</h3>
                  <div className="p-4 border border-red-200 rounded-md bg-red-50">
                    <h4 className="font-medium text-red-700 mb-2">Delete Account</h4>
                    <p className="text-sm text-gray-700 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" className='text-white transition duration-300 hover:bg-red-700'>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Customize when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Email Activity</Label>
                          <p className="text-sm text-gray-500">Get notified when emails are opened or clicked</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            checked={notifyEmails}
                            onChange={() => setNotifyEmails(!notifyEmails)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Client Responses</Label>
                          <p className="text-sm text-gray-500">Get notified when clients reply to your emails</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            checked={notifyResponses}
                            onChange={() => setNotifyResponses(!notifyResponses)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Client Updates</Label>
                          <p className="text-sm text-gray-500">Get notified about client status changes</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            checked={notifyClients}
                            onChange={() => setNotifyClients(!notifyClients)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base">Weekly Digest</Label>
                          <p className="text-sm text-gray-500">Receive a weekly summary of your email performance</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            checked={weeklyDigest}
                            onChange={() => setWeeklyDigest(!weeklyDigest)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={handleSaveNotifications}
                    >
                      Save Preferences
                    </Button>
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