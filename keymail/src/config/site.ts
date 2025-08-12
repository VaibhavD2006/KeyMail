export const siteConfig = {
  name: "KeyMail",
  description: "AI-Powered Real Estate Email Marketing Platform",
  url: "https://keymail.app",
  ogImage: "https://keymail.app/og.jpg",
  links: {
    github: "https://github.com/yourusername/keymail",
    twitter: "https://twitter.com/keymail",
  },
  creator: "Your Company Name",
  theme: {
    primaryColor: "#8A2BE2", // Vibrant purple
    primaryLight: "#F5F0FF", // Very light purple for backgrounds
    primaryDark: "#6A1CB7", // Darker purple for hover states
    accentColor: "#4F46E5", // Indigo for accents
    textPrimary: "#111827", // Near black for main text
    textSecondary: "#6B7280", // Gray for secondary text
  }
};

export const dashboardConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Features",
      href: "/features",
    },
    {
      title: "Blog",
      href: "/blog",
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
    },
    {
      title: "Emails",
      href: "/dashboard/emails",
      icon: "mail",
    },
    {
      title: "Templates",
      href: "/dashboard/emails/templates",
      icon: "template",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};

export const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    description: "Basic features for small real estate agents",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "50 client limit",
      "Basic email templates",
      "Standard personalization",
      "Manual email sending",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for growing real estate businesses",
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      "200 client limit",
      "Advanced templates",
      "Enhanced personalization",
      "Scheduled sending",
      "Basic analytics",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Premium features for established real estate agencies",
    price: {
      monthly: 79,
      yearly: 790,
    },
    features: [
      "Unlimited clients",
      "Premium templates",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Team collaboration",
    ],
  },
]; 