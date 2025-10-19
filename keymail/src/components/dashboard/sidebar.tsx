"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Mail,
  Settings,
  Calendar,
  BarChart,
  HelpCircle,
  FileText,
  Gift,
  Target,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Clients",
    icon: Users,
    href: "/clients",
    color: "text-violet-500",
  },
  {
    label: "Milestones",
    icon: Gift,
    href: "/milestones",
    color: "text-purple-500",
  },
  {
    label: "Matches",
    icon: Target,
    href: "/matches",
    color: "text-orange-500",
  },
  {
    label: "Showings",
    icon: Calendar,
    href: "/showings",
    color: "text-blue-500",
  },
  {
    label: "Listings",
    icon: Home,
    href: "/listings",
    color: "text-green-500",
  },
  {
    label: "Emails",
    icon: Mail,
    href: "/emails",
    color: "text-pink-700",
  },
  {
    label: "Templates",
    icon: FileText,
    href: "/templates",
    color: "text-indigo-500",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
    color: "text-orange-500",
  },
  {
    label: "Analytics",
    icon: BarChart,
    href: "/analytics",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
  {
    label: "Help",
    icon: HelpCircle,
    href: "/help",
    color: "text-blue-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-gray-800 border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-8">
          <div className="relative w-8 h-8 mr-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">K</div>
          </div>
          <h1 className="text-xl font-bold">KeyMail</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-purple-600 hover:bg-purple-50 rounded-lg transition",
                pathname === route.href
                  ? "text-purple-600 bg-purple-50"
                  : "text-gray-600"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 