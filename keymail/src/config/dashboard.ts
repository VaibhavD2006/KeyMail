export const dashboardConfig = {
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Support",
      href: "/support",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: "users",
      items: [
        {
          title: "All Clients",
          href: "/dashboard/clients",
          icon: "list",
        },
        {
          title: "Add Client",
          href: "/dashboard/clients/add",
          icon: "plus",
        },
      ],
    },
    {
      title: "Emails",
      href: "/dashboard/emails",
      icon: "mail",
      items: [
        {
          title: "Email Dashboard",
          href: "/dashboard/emails",
          icon: "inbox",
        },
        {
          title: "Compose",
          href: "/dashboard/emails/compose",
          icon: "pencil",
        },
        {
          title: "Templates",
          href: "/dashboard/emails/templates",
          icon: "template",
        },
      ],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};

export const userNavConfig = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: "user",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: "creditCard",
  },
  {
    title: "Support",
    href: "/support",
    icon: "help",
  },
  {
    title: "Sign out",
    href: "/auth/signout",
    icon: "logout",
  },
];

export const dashboardTabs = {
  clients: [
    {
      title: "Overview",
      href: "/dashboard/clients",
      icon: "users",
    },
    {
      title: "Active",
      href: "/dashboard/clients?status=active",
      icon: "check",
    },
    {
      title: "Pending",
      href: "/dashboard/clients?status=pending",
      icon: "clock",
    },
    {
      title: "Archived",
      href: "/dashboard/clients?status=archived",
      icon: "archive",
    },
  ],
  emails: [
    {
      title: "All",
      href: "/dashboard/emails",
      icon: "inbox",
    },
    {
      title: "Drafts",
      href: "/dashboard/emails?status=draft",
      icon: "edit",
    },
    {
      title: "Pending",
      href: "/dashboard/emails?status=pending",
      icon: "clock",
    },
    {
      title: "Sent",
      href: "/dashboard/emails?status=sent",
      icon: "check",
    },
    {
      title: "Scheduled",
      href: "/dashboard/emails?status=scheduled",
      icon: "calendar",
    },
  ],
  templates: [
    {
      title: "All",
      href: "/dashboard/emails/templates",
      icon: "template",
    },
    {
      title: "Birthdays",
      href: "/dashboard/emails/templates?category=birthday",
      icon: "cake",
    },
    {
      title: "Anniversaries",
      href: "/dashboard/emails/templates?category=anniversary",
      icon: "gift",
    },
    {
      title: "Holidays",
      href: "/dashboard/emails/templates?category=holiday",
      icon: "calendar",
    },
    {
      title: "Market Updates",
      href: "/dashboard/emails/templates?category=market",
      icon: "chart",
    },
    {
      title: "Custom",
      href: "/dashboard/emails/templates?category=custom",
      icon: "settings",
    },
  ],
}; 