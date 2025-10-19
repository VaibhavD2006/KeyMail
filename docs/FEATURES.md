# KeyMail Feature Implementation Guide

## Overview

This document outlines the implementation details for KeyMail's core features:

1. **Create Personalized AI-Based Templates**
2. **Automate Sending Emails**
3. **Track Email Analytics**

## 1. Create Personalized AI-Based Templates

### Functionality
- Generate email templates using AI (birthdays, anniversaries, etc.)
- Allow template customization before sending

### Implementation Steps

#### 1.1 OpenAI API Integration
- **API:** OpenAI GPT-4/3.5
- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Authentication:** Bearer token from OpenAI dashboard

```json
POST https://api.openai.com/v1/chat/completions
Headers:
  Authorization: Bearer YOUR_OPENAI_API_KEY
  Content-Type: application/json

Body:
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are an AI that generates personalized email templates for real estate agents."},
    {"role": "user", "content": "Generate a birthday email for John Smith, who has been a client for 3 years."}
  ]
}
```

#### 1.2 Template Storage
- **Database Table:** `email_templates`
- **Schema:**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| client_id | UUID | FK to Clients table |
| occasion | String | Birthday, anniversary, etc. |
| generated_content | Text | Original AI content |
| edited_content | Text | User-modified content |
| status | String | draft, sent, etc. |

#### 1.3 Frontend Integration
- Create form for template generation parameters
- Display and allow editing of generated templates

## 2. Automate Sending Emails

### Functionality
- Gmail integration
- Schedule emails for future delivery
- Automated sending based on schedule

### Implementation Steps

#### 2.1 Gmail API Integration
- **API:** Gmail API
- **Endpoint:** `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`
- **Authentication:** OAuth 2.0

#### 2.2 OAuth Setup
1. Create Google Cloud Console project
2. Enable Gmail API
3. Configure OAuth consent screen
4. Generate credentials
5. Implement OAuth flow with appropriate library

#### 2.3 Send Email Example

```javascript
POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
  Content-Type: application/json

Body:
{
  "raw": "RnJvbTogWW91ciBOYW1lIDx5b3VyZW1haWxAZ21haWwuY29tPgpUbzogY2xpZW50QGV4YW1wbGUuY29tCgpTdWJqZWN0OiBIYXBweSBCaXJ0aGRheSEKCkRlYXIgSm9obiwKCkhvcGUgeW91J3JlIGhhdmluZyBhIGdyZWF0IGRheSEKClJlZ2FyZHMsClRlYW0gS2V5TWFpbA=="
}
```

#### 2.4 Email Scheduling
- Implement task scheduler (node-cron, Celery, etc.)
- **Database Table:** `scheduled_emails`
- **Schema:**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| client_id | UUID | FK to Clients table |
| template_id | UUID | FK to Templates table |
| scheduled_date | DateTime | When to send |
| status | String | scheduled, sent, failed |

#### 2.5 Frontend Components
- Calendar/datetime picker for scheduling
- List view of scheduled emails with CRUD operations

## 3. Track Email Analytics

### Functionality
- Track open rates, click rates, and response times
- Generate analytics reports

### Implementation Steps

#### 3.1 Analytics API Integration
- Use Mailchimp or SendGrid for tracking
- **Mailchimp:** `https://usX.api.mailchimp.com/3.0/campaigns`
- **SendGrid:** `https://api.sendgrid.com/v3/stats`

#### 3.2 Tracking Implementation
- **Open Tracking:** Embed 1x1 transparent pixel
- **Click Tracking:** Use UTM parameters and redirects
- **Response Tracking:** Monitor inbox for replies

#### 3.3 Analytics Storage
- **Database Table:** `email_analytics`
- **Schema:**

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email_id | UUID | FK to Emails table |
| open_rate | Float | % of opens |
| click_rate | Float | % of clicks |
| response_time | Integer | Hours to respond |

#### 3.4 Analytics Dashboard
- Implement with Chart.js or D3.js
- Display metrics, trends, and comparative data

## Development Checklist

- [ ] Set up OpenAI API integration
- [ ] Create database tables and models
- [ ] Implement Gmail OAuth flow
- [ ] Build email scheduling system
- [ ] Set up tracking mechanisms
- [ ] Develop analytics dashboard
- [ ] Add error handling and logging

## Best Practices

1. Store all API keys in environment variables
2. Implement rate limiting for external APIs
3. Add comprehensive error handling
4. Create unit tests for each component
5. Use background jobs for long-running tasks
6. Implement proper security measures for email data