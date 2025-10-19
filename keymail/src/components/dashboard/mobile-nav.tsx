"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Mail,
  Settings,
  Calendar,
  BarChart,
  HelpCircle,
  Menu,
} from "lucide-react";

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
    label: "Emails",
    icon: Mail,
    href: "/emails",
    color: "text-pink-700",
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

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/dashboard" className="flex items-center pl-3 mb-8">
          <div className="relative w-8 h-8 mr-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">K</div>
          </div>
          <h1 className="text-xl font-bold">KeyMail</h1>
        </Link>
        <div className="space-y-1 py-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
} 