# Insighta Labs+ Web Portal

The executive dashboard and analyst interface for the Insighta Labs+ Profile Intelligence Platform.

## Features
- **Secure Login**: GitHub OAuth integration with session persistence.
- **Executive Dashboard**: Real-time metrics on profile distribution and user roles.
- **Advanced Explorer**: Filter and browse profiles with server-side pagination.
- **Search Console**: Natural language search interface for complex queries.
- **Profile Detail**: Deep-dive views into individual profile attributes.
- **Account Management**: View session info and logout securely.

## Tech Stack
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons/Fonts**: Inter & Custom SVG

## Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Config**: Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_id
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
   NEXT_PUBLIC_API_URL=http://localhost:8081
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## Design System
- **Theme**: Dark Mode (Gray-950 base)
- **Accent**: Indigo/Purple gradients
- **Components**: Fully responsive, accessible, and high-performance.
