# KeyMail - AI-Powered Real Estate Email Marketing Platform

## 🎯 Overview

KeyMail is a web application designed to help real estate agents automate personalized email campaigns for client retention. The platform leverages AI to generate contextual email templates for various occasions while maintaining a human touch through an approval workflow.

## 🌟 Core Features

### Client Management

- **Manual Data Entry**
  - Add individual client profiles with key details
  - Customize fields based on needs
  - Track important dates (birthdays, closing anniversaries)
  - Store relationship context

- **Bulk Import**
  - CSV file upload support
  - Standardized template format
  - Data validation

### AI Email Generation

- **Smart Templates**
  - Celebratory messages (birthdays, anniversaries)
  - Market updates and newsletters
  - Holiday greetings
  - Relationship milestones

- **Personalization Engine**
  - Dynamic content insertion
  - Tone adjustment based on relationship
  - Context-aware messaging

### Approval System

- **Review Process**
  - Dashboard notifications
  - Email preview and editing
  - Batch approval options

- **Scheduling**
  - Automated sending
  - Time zone management
  - Delivery confirmation

### Email Platform Integration

- **Supported Services**
  - Gmail (Google Workspace)
  - Microsoft Outlook
  - Mailchimp

- **Security**
  - OAuth 2.0 authentication
  - Secure token management
  - Data encryption

### Subscription Tiers

#### Free Plan
- 50 client limit
- Basic email templates
- Standard personalization

#### Premium Plans
- Expanded client limits (200/500/unlimited)
- Advanced templates
- Analytics dashboard
- Priority support

## 🔄 User Journey

1. **Sign Up & Setup**
   - Account creation
   - Email service connection
   - Initial client import

2. **Client Database**
   - Profile management
   - Event tracking
   - Relationship updates

3. **Email Workflow**
   - AI template generation
   - Review notifications
   - Content customization
   - Scheduling
   - Resend API

4. **Automation**
   - Scheduled delivery
   - Delivery tracking
   - Activity logging

## 🛠 Technical Architecture

### Frontend
- **Framework**: Next.js
- **UI Components**: Shadcn
- **Key Pages**:
  - Dashboard
  - Client Manager
  - Email Studio
  - Settings Hub
  - Billing Portal

### Backend
- **Services**:
  - Python (AI Engine)
  - Node.js (API Layer)
- **Integrations**:
  - OpenAI API
  - Email Service APIs
- **Database**: MongoDB

### Authentication
- NextAuth.js/Firebase Auth
- OAuth 2.0 Providers:
  - Google
  - Microsoft
  - Mailchimp

### AI Components
- **OpenAI Integration**
  - Template generation
  - Tone analysis
  - Content optimization

### Email Service
- Nodemailer implementation
- Mailchimp API integration
- Queue management

## 📊 Data Schema

### Database Collections

#### Users Collection
```json
{
  "id": "UUID",
  "email": "String",
  "name": "String",
  "companyName": "String",
  "plan": "String (free/premium/enterprise)",
  "createdAt": "Date",
  "settings": {
    "timezone": "String",
    "emailSignature": "String",
    "defaultEmailTemplate": "String"
  },
  "emailIntegration": {
    "provider": "String (gmail/outlook/mailchimp)",
    "accessToken": "String",
    "refreshToken": "String",
    "expiresAt": "Date"
  }
}
```

#### Clients Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "name": "String",
  "email": "String",
  "phone": "String",
  "birthday": "Date",
  "closingAnniversary": "Date",
  "yearsKnown": "Integer",
  "relationshipLevel": "String",
  "tags": ["String"],
  "customFields": {
    "field1": "Value1",
    "field2": "Value2"
  },
  "preferences": {
    "communicationFrequency": "String",
    "preferredContactMethod": "String"
  },
  "lastContactDate": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Emails Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "clientId": "UUID",
  "occasion": "String",
  "subject": "String",
  "generatedContent": "Text",
  "editedContent": "Text",
  "status": "String (draft/pending/approved/sent/failed)",
  "scheduledDate": "Date",
  "sentDate": "Date",
  "metadata": {
    "templateId": "String",
    "aiParameters": {
      "tone": "String",
      "style": "String",
      "length": "String"
    }
  },
  "analytics": {
    "opened": "Boolean",
    "openedAt": "Date",
    "clicked": "Boolean",
    "clickedAt": "Date"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Templates Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "name": "String",
  "category": "String",
  "content": "Text",
  "variables": ["String"],
  "isDefault": "Boolean",
  "metadata": {
    "tone": "String",
    "occasion": "String",
    "suggestedUse": "String"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### Analytics Collection
```json
{
  "id": "UUID",
  "userId": "UUID",
  "period": "String (daily/weekly/monthly)",
  "date": "Date",
  "metrics": {
    "emailsSent": "Integer",
    "emailsOpened": "Integer",
    "clickThroughRate": "Float",
    "clientEngagement": "Float"
  },
  "createdAt": "Date"
}
```

## 📁 Project Structure

```
keymail/
├── .github/                      # GitHub Actions workflows
├── .vscode/                      # VS Code settings
├── app/                          # Next.js app directory (main application code)
│   ├── (auth)/                  # Authentication group
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── register/
│   │   │   └── page.tsx         # Registration page
│   │   └── layout.tsx           # Auth layout
│   ├── (dashboard)/             # Protected dashboard group
│   │   ├── clients/
│   │   │   ├── [id]/           # Dynamic client routes
│   │   │   │   └── page.tsx
│   │   │   ├── add/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx        # Clients list
│   │   ├── emails/
│   │   │   ├── templates/
│   │   │   │   └── page.tsx
│   │   │   ├── compose/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx        # Email dashboard
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Dashboard layout
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   ├── clients/
│   │   ├── emails/
│   │   └── webhooks/
│   ├── error.tsx               # Error boundary
│   ├── loading.tsx            # Loading UI
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                 # React components
│   ├── ui/                    # Shadcn components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── forms/                 # Form components
│   │   ├── client-form.tsx
│   │   ├── email-form.tsx
│   │   └── ...
│   ├── email/                 # Email components
│   │   ├── editor.tsx
│   │   ├── preview.tsx
│   │   └── ...
│   ├── client/               # Client components
│   │   ├── card.tsx
│   │   ├── list.tsx
│   │   └── ...
│   └── shared/               # Shared components
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── ...
├── lib/                      # Utility functions
│   ├── ai/                  # AI utilities
│   │   ├── openai.ts
│   │   └── templates.ts
│   ├── auth/               # Auth utilities
│   │   ├── session.ts
│   │   └── middleware.ts
│   ├── db/                # Database utilities
│   │   ├── mongodb.ts
│   │   └── queries.ts
│   └── email/             # Email utilities
│       ├── providers.ts
│       └── send.ts
├── hooks/                 # Custom React hooks
│   ├── use-clients.ts
│   ├── use-emails.ts
│   └── ...
├── types/                 # TypeScript types
│   ├── client.ts
│   ├── email.ts
│   └── ...
├── config/               # Configuration
│   ├── site.ts
│   └── dashboard.ts
├── styles/              # Global styles
│   └── globals.css
├── public/             # Static assets
│   ├── images/
│   └── fonts/
├── docs/               # Documentation
│   ├── CONTEXT.md
│   └── API.md
├── tests/             # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/          # Build and deployment scripts
├── middleware.ts    # Next.js middleware
├── .env.example    # Environment variables example
├── .eslintrc.js   # ESLint configuration
├── .prettierrc    # Prettier configuration
├── jest.config.js # Jest configuration
├── next.config.js # Next.js configuration
├── package.json   # Dependencies and scripts
├── tsconfig.json  # TypeScript configuration
└── README.md      # Project documentation
```

## 📝 Development Roadmap

### Phase 1: Foundation
1. ⬜ Next.js project setup with Shadcn
2. ⬜ Database implementation
3. ⬜ Basic authentication

### Phase 2: Core Features
4. ⬜ Client management system
5. ⬜ AI integration
6. ⬜ Email service connection

### Phase 3: Workflow
7. ⬜ Approval system
8. ⬜ Automation engine
9. ⬜ Analytics dashboard

## 🔜 Future Enhancements

- Advanced analytics
- Mobile application
- Drip campaign automation
- Multi-agent support
- CRM integrations
- Custom AI model training

VC8NUB41WJHZSSQGF5HDM5HP