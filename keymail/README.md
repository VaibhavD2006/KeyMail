# KeyMail - AI-Powered Real Estate Email Marketing Platform

## Overview

KeyMail is a web application designed to help real estate agents automate personalized email campaigns for client retention. The platform leverages AI to generate contextual email templates for various occasions while maintaining a human touch through an approval workflow.

## Core Features

- **Client Management**: Add and manage client profiles with key details and relationship context
- **AI Email Generation**: Create personalized email templates for various occasions
- **Approval System**: Review and approve emails before sending
- **Email Platform Integration**: Connect with popular email services
- **Subscription Tiers**: Free and premium plans with different features

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/keymail.git
   cd keymail
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

The project follows a modular structure with Next.js App Router:

- `app/`: Next.js application routes
- `components/`: Reusable React components
- `lib/`: Utility functions and services
- `hooks/`: Custom React hooks
- `types/`: TypeScript type definitions
- `config/`: Application configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
