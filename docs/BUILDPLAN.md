# 🏠 KeyMail - Real Estate Email Automation Platform
## MVP Build Plan & Technical Specifications

---

## 📋 Project Overview

**KeyMail** is a comprehensive real estate email automation platform that helps agents maintain client relationships through AI-powered personalized communications, MLS integration, and automated follow-ups.

**Target Users**: Real estate agents, brokers, and real estate teams
**Primary Goal**: Automate client communication while maintaining personal touch through AI personalization

---

## 🎯 MVP Core Features (Priority Order)

### 1. 🎂 **Closing & Milestone Automation** (HIGHEST PRIORITY)
**Why First**: Most emotionally resonant, immediate value for agents

### 2. 🚀 **One-Click MLS Email Builder**
**Why Second**: Core productivity tool for daily operations

### 3. 🎯 **AI Buyer Match Engine**
**Why Third**: Advanced feature for proactive client engagement

### 4. 💬 **Automated Showing Follow-Ups**
**Why Fourth**: Operational efficiency for post-showing communication

---

## 🏗️ Technical Architecture

### **Technology Stack**
- **Frontend**: Next.js 14 + React 19 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Backend**: Next.js API Routes + PostgreSQL (Drizzle ORM)
- **Authentication**: NextAuth.js (Google + Email providers)
- **AI Integration**: OpenAI GPT-4 API
- **Email Service**: SendGrid or Mailgun
- **Scheduling**: Vercel Cron Jobs for automation tasks
- **Database**: PostgreSQL with localStorage fallback

### **Database Schema Requirements**
```sql
-- Core Tables Needed:
clients (id, name, email, phone, address, notes, relationship_level, status, tags, created_at, updated_at)
email_templates (id, user_id, name, occasion, subject, generated_content, edited_content, status, tags, created_at, updated_at)
email_history (id, user_id, client_id, template_id, subject, content, sent_at, status, open_rate, click_rate)
listings (id, mls_id, address, price, description, photos, features, created_at)
showings (id, client_id, listing_id, scheduled_at, completed_at, feedback)
milestones (id, client_id, type, date, message, created_at)
```

---

## 🔧 Feature 1: Closing & Milestone Automation (Weeks 3-4)

### **Objective**
Automatically send personalized emails for client milestones: home anniversaries, birthdays, and personal events.

### **Technical Implementation**

#### **Database Extensions**
```typescript
// Add to clients table
interface Client {
  // ... existing fields
  closingDate?: Date;           // When they bought their home
  birthday?: Date;              // Client birthday
  spouseBirthday?: Date;        // Spouse birthday
  childrenBirthdays?: Date[];   // Children birthdays
  milestonePreferences?: {      // What milestones to celebrate
    homeAnniversary: boolean;
    birthday: boolean;
    personalEvents: boolean;
  };
}

// New milestones table
interface Milestone {
  id: string;
  clientId: string;
  type: 'home_anniversary' | 'birthday' | 'personal_event';
  date: Date;
  message?: string;
  lastSent?: Date;
  nextSendDate: Date;
  isActive: boolean;
}
```

#### **API Endpoints**
```typescript
// GET /api/milestones - Get upcoming milestones
// POST /api/milestones - Create new milestone
// PUT /api/milestones/[id] - Update milestone
// DELETE /api/milestones/[id] - Delete milestone
// POST /api/milestones/send - Send milestone email
// GET /api/milestones/upcoming - Get next 30 days of milestones
```

#### **Automation Logic**
```typescript
// Vercel Cron Job (runs daily at 9 AM)
export async function checkMilestones() {
  const today = new Date();
  const upcomingMilestones = await getUpcomingMilestones(today);
  
  for (const milestone of upcomingMilestones) {
    if (shouldSendMilestone(milestone)) {
      await sendMilestoneEmail(milestone);
      await updateMilestoneLastSent(milestone.id);
    }
  }
}
```

#### **UI Components Required**
- **Milestone Dashboard**: Overview of upcoming milestones
- **Client Profile Extensions**: Add milestone dates to client forms
- **Template Editor**: Customize milestone email templates
- **Automation Settings**: Toggle which milestones are automated
- **Milestone Calendar**: Visual calendar view of upcoming events

---

## 🚀 Feature 2: One-Click MLS Email Builder (Week 5)

### **Objective**
Generate personalized property emails instantly by pasting an MLS ID.

### **Technical Implementation**

#### **MLS Integration**
```typescript
// API endpoint: /api/mls/fetch-listing
interface MLSListing {
  mlsId: string;
  address: string;
  price: number;
  description: string;
  photos: string[];
  features: string[];
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number;
}

// Function to fetch MLS data
async function fetchMLSListing(mlsId: string): Promise<MLSListing> {
  // Integration with MLS provider API
  // Fallback to manual entry if API fails
}
```

#### **AI Email Generation**
```typescript
// API endpoint: /api/emails/generate-mls
interface MLSEmailRequest {
  mlsId: string;
  clientId: string;
  tone: 'professional' | 'casual' | 'urgent';
  customMessage?: string;
}

// AI prompt for MLS emails
const mlsEmailPrompt = `
Generate a personalized real estate email for a client about this property:
Property: ${listing.address} - $${listing.price}
Features: ${listing.features.join(', ')}
Client: ${client.name} (${client.preferences})

Tone: ${tone}
Custom message: ${customMessage}

Generate a compelling email that:
1. Mentions the client by name
2. Highlights why this property matches their preferences
3. Includes key property details
4. Has a clear call-to-action
5. Maintains the specified tone
`;
```

#### **UI Components Required**
- **MLS ID Input**: Simple input field for MLS number
- **Property Preview**: Display fetched MLS data
- **Email Editor**: AI-generated content with editing capabilities
- **Client Selection**: Choose which client to send to
- **Tone Selection**: Professional/Casual/Urgent options
- **Send Preview**: Final review before sending

---

## 🎯 Feature 3: AI Buyer Match Engine (Week 6)

### **Objective**
Automatically match properties to clients based on preferences and send personalized bulk emails.

### **Technical Implementation**

#### **Client Preference System**
```typescript
// Extend clients table
interface ClientPreferences {
  priceRange: { min: number; max: number };
  neighborhoods: string[];
  propertyTypes: ('single_family' | 'condo' | 'townhouse')[];
  bedrooms: { min: number; max: number };
  bathrooms: { min: number; max: number };
  mustHaves: string[];
  dealBreakers: string[];
  urgency: 'low' | 'medium' | 'high';
}
```

#### **Matching Algorithm**
```typescript
// API endpoint: /api/matching/find-matches
interface MatchRequest {
  clientId: string;
  maxMatches?: number; // Default: 3
}

interface PropertyMatch {
  listing: MLSListing;
  matchScore: number; // 0-100
  reasons: string[];  // Why this property matches
}

// Matching logic
function calculateMatchScore(client: Client, listing: MLSListing): number {
  let score = 0;
  
  // Price match (40% weight)
  if (listing.price >= client.preferences.priceRange.min && 
      listing.price <= client.preferences.priceRange.max) {
    score += 40;
  }
  
  // Neighborhood match (25% weight)
  if (client.preferences.neighborhoods.includes(listing.neighborhood)) {
    score += 25;
  }
  
  // Property type match (20% weight)
  if (client.preferences.propertyTypes.includes(listing.propertyType)) {
    score += 20;
  }
  
  // Bedroom/bathroom match (15% weight)
  if (listing.bedrooms >= client.preferences.bedrooms.min &&
      listing.bedrooms <= client.preferences.bedrooms.max) {
    score += 7.5;
  }
  
  if (listing.bathrooms >= client.preferences.bathrooms.min &&
      listing.bathrooms <= client.preferences.bathrooms.max) {
    score += 7.5;
  }
  
  return score;
}
```

#### **UI Components Required**
- **Client Preference Form**: Comprehensive preference collection
- **Matching Dashboard**: View all client matches
- **Property Selection**: Choose which properties to send
- **Bulk Email Queue**: Review and send multiple emails
- **Match Analytics**: Track match success rates

---

## 💬 Feature 4: Automated Showing Follow-Ups (Week 7)

### **Objective**
Automatically follow up with clients after property showings to gather feedback and maintain engagement.

### **Technical Implementation**

#### **Showing Management**
```typescript
// API endpoint: /api/showings/create
interface Showing {
  id: string;
  clientId: string;
  listingId: string;
  scheduledAt: Date;
  completedAt?: Date;
  agentNotes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// API endpoint: /api/showings/feedback
interface ShowingFeedback {
  id: string;
  showingId: string;
  clientId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  liked: boolean;
  comments?: string;
  followUpNeeded: boolean;
  nextAction?: string;
}
```

#### **Automation Scheduler**
```typescript
// Vercel Cron Job (runs every 30 minutes)
export async function checkShowingsForFollowUp() {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  
  const completedShowings = await getCompletedShowings(twoHoursAgo, now);
  
  for (const showing of completedShowings) {
    if (!await hasFollowUpBeenSent(showing.id)) {
      await sendShowingFollowUp(showing);
    }
  }
}
```

#### **UI Components Required**
- **Showing Calendar**: Schedule and track showings
- **Feedback Dashboard**: View client feedback and ratings
- **Follow-up Templates**: Customize follow-up email content
- **Showing Analytics**: Track showing success rates

---

## 📅 Development Timeline

### **Week 1-2: Foundation & Infrastructure**
- [ ] Set up Next.js 14 project with TypeScript
- [ ] Configure PostgreSQL database with Drizzle ORM
- [ ] Implement NextAuth.js authentication
- [ ] Create basic database schema
- [ ] Set up OpenAI API integration
- [ ] Configure email service (SendGrid/Mailgun)
- [ ] Create basic UI components with shadcn/ui

### **Week 3-4: Closing & Milestone Automation (Primary Feature)**
- [ ] Extend client database schema for milestones
- [ ] Create milestone management system
- [ ] Implement automated email scheduling
- [ ] Build milestone dashboard UI
- [ ] Create milestone email templates
- [ ] Set up Vercel cron jobs for automation

### **Week 5: One-Click MLS Email Builder**
- [ ] Integrate MLS API or create manual entry system
- [ ] Build AI email generation for property listings
- [ ] Create email preview and editor interface
- [ ] Implement email sending functionality
- [ ] Add email tracking and history

### **Week 6: AI Buyer Match Engine**
- [ ] Extend client preferences system
- [ ] Implement property matching algorithm
- [ ] Create matching dashboard
- [ ] Build bulk email generation system
- [ ] Add match analytics and tracking

### **Week 7: Automated Showing Follow-Ups**
- [ ] Create showing management system
- [ ] Implement feedback collection
- [ ] Build automated follow-up system
- [ ] Create showing analytics dashboard
- [ ] Set up follow-up email templates

### **Week 8: Polish, Testing & Deployment**
- [ ] Comprehensive testing of all features
- [ ] Performance optimization
- [ ] Bug fixes and refinements
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Documentation and user guides

---

## 🎯 Success Metrics

### **User Engagement**
- Daily active users
- Email open rates
- Client response rates
- Template usage frequency

### **Business Impact**
- Time saved per email
- Client engagement improvement
- Follow-up response rates
- Milestone celebration success

### **Technical Performance**
- Email delivery success rate
- AI generation response time
- Database query performance
- API response times

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- PostgreSQL database
- OpenAI API key
- SendGrid or Mailgun account
- Vercel account for deployment

### **Local Development Setup**
```bash
# Clone repository
git clone [repository-url]
cd keymail

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

---

## 📝 Notes for Development

1. **Start with Milestone Automation** - This provides immediate value and is emotionally resonant
2. **Use localStorage fallback** - Ensure app works even without database connection
3. **Focus on UI/UX** - Real estate agents need intuitive, fast interfaces
4. **Test AI prompts thoroughly** - Real estate communication requires specific tone and compliance
5. **Build for scale** - Consider multiple MLS providers and email service fallbacks

---

*This build plan prioritizes features that provide immediate value to real estate agents while building toward a comprehensive client relationship management platform.*