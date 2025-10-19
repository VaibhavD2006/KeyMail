# KeyMail - AI-Powered Email Marketing for Real Estate Professionals

KeyMail is a web application designed to help real estate agents automate personalized email campaigns for client retention. The platform leverages AI to generate contextual email templates for various occasions while maintaining a human touch through an approval workflow.

![KeyMail Landing Page](https://i.imgur.com/example.png)

## Features

- **Client Management**: Add individual client profiles with key details, customize fields, track important dates, and store relationship context.
- **AI Email Generation**: Smart templates for celebratory messages, market updates, newsletters, holiday greetings, and relationship milestones.
- **Personalization Engine**: Dynamic content insertion, tone adjustment based on relationship, and context-aware messaging.
- **Approval System**: Dashboard notifications, email preview and editing, and batch approval options.
- **Email Platform Integration**: Support for Gmail (Google Workspace), Microsoft Outlook, and Mailchimp.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Python (AI Engine)
- **Database**: MongoDB
- **Authentication**: NextAuth.js/Firebase Auth
- **AI Components**: OpenAI integration

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/keymail.git
   cd keymail
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

The project follows a standard Next.js structure with the app router pattern:

- `app/`: The main application code
  - `(auth)/`: Authentication-related pages
  - `(dashboard)/`: Protected dashboard pages
  - `api/`: API routes
- `components/`: Reusable React components
  - `ui/`: Shadcn UI components
  - `forms/`: Form components
  - `email/`: Email-related components
  - `client/`: Client-related components
  - `shared/`: Shared components
- `lib/`: Utility functions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [OpenAI](https://openai.com/)
