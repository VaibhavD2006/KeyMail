# 🚀 KeyMail - AI-Powered Email Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)](https://openai.com/)

> **Transform your business communication with AI-powered personalized email templates and intelligent client management.**

## ✨ Features

### 🎯 **Client Management System**
- **Comprehensive Client Profiles** - Store contact info, relationship levels, tags, and notes
- **Advanced Filtering & Search** - Find clients by name, relationship level, tags, or status
- **CRUD Operations** - Full create, read, update, and delete functionality
- **Client Categorization** - Organize by VIP, Regular, Prospect, and custom levels

### 🤖 **AI-Powered Email Templates**
- **Smart Content Generation** - GPT-4 powered email creation based on client data
- **Personalization Engine** - Automatically personalize emails using client information
- **Multiple Occasions** - Pre-built templates for follow-ups, thank yous, promotions
- **Content Enhancement** - AI suggestions for improving email quality and effectiveness
- **Tone & Style Control** - Customizable professional, friendly, or casual tones

### 📧 **Email Management**
- **Template Library** - Organized collection of reusable email templates
- **Content Analysis** - AI-powered email analysis for sentiment and improvement
- **Version Control** - Track changes and edits to templates over time
- **Performance Tracking** - Monitor email effectiveness and engagement

### 🔐 **Authentication & Security**
- **Multi-Provider Auth** - Google OAuth and Email-based authentication
- **Secure Sessions** - JWT-based session management
- **User Profiles** - Personalized accounts with customizable settings
- **Role-Based Access** - Secure access control for different user types

### 🎨 **Modern User Interface**
- **Responsive Dashboard** - Mobile-first design with adaptive layouts
- **Purple Theme** - Custom branding with professional aesthetics
- **Intuitive Navigation** - Sidebar navigation with mobile-responsive menu
- **Real-time Updates** - Live data updates and notifications

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework

### **UI Components**
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, reusable components
- **Custom Theme** - Purple-based design system

### **Backend & Database**
- **PostgreSQL** - Primary database with Drizzle ORM
- **localStorage Fallback** - Offline capability and data persistence
- **NextAuth.js** - Authentication framework

### **AI Integration**
- **OpenAI GPT-4** - State-of-the-art language model
- **Context-Aware Generation** - Intelligent content creation
- **Smart Suggestions** - AI-powered improvements

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- PostgreSQL (optional - app works with localStorage fallback)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/VaibhavD2006/KeyMail.git
   cd KeyMail/keymail
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database (optional)
   DATABASE_URL=postgresql://username:password@localhost:5432/keymail
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### **Client Management**
1. **Add New Clients** - Navigate to `/clients/add` to create client profiles
2. **View Clients** - Browse your client list at `/clients`
3. **Edit Clients** - Update client information and preferences
4. **Organize** - Use tags and relationship levels for better organization

### **Email Templates**
1. **Create Templates** - Build email templates at `/templates/create`
2. **AI Generation** - Use AI to generate personalized content
3. **Customize** - Edit and refine generated content
4. **Save & Reuse** - Store templates for future use

### **AI Features**
1. **Content Generation** - Generate emails based on client data and occasion
2. **Content Analysis** - Get AI feedback on email quality
3. **Content Enhancement** - Improve emails with AI suggestions

## 🏗️ Project Structure

```
keymail/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Dashboard layout
│   │   │   ├── clients/        # Client management pages
│   │   │   ├── templates/      # Template management pages
│   │   │   └── dashboard/      # Main dashboard
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── clients/        # Client CRUD operations
│   │   │   ├── templates/      # Template operations
│   │   │   └── emails/         # AI email services
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI components
│   │   ├── client/             # Client-specific components
│   │   └── dashboard/          # Dashboard components
│   ├── lib/                    # Utility libraries
│   │   ├── db/                 # Database configuration
│   │   ├── auth.ts             # Authentication setup
│   │   ├── ai/                 # AI integration
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🔧 Configuration

### **Database Setup**
The application automatically falls back to localStorage if PostgreSQL is unavailable. To use a database:

1. Install PostgreSQL
2. Create a database named `keymail`
3. Set `DATABASE_URL` in your environment variables
4. The app will automatically create necessary tables

### **Authentication Setup**
1. **Google OAuth**: Create OAuth credentials in Google Cloud Console
2. **Email Provider**: Configure SMTP settings for email authentication
3. **NextAuth**: Set up NextAuth.js configuration

### **AI Integration**
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add the key to your environment variables
3. The AI features will automatically become available

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- **Netlify**: Build command: `npm run build`
- **Railway**: Supports PostgreSQL out of the box
- **Heroku**: Add PostgreSQL addon and set buildpacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **OpenAI** - For providing the GPT-4 API
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/VaibhavD2006/KeyMail/issues)
- **Discussions**: [GitHub Discussions](https://github.com/VaibhavD2006/KeyMail/discussions)
- **Email**: [Your Email]

---

**Made with ❤️ by [Your Name]**

*Transform your business communication today with KeyMail!*
