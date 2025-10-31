# Caroumate - AI Carousel Generator

AI-powered social media carousel generator with Supabase database and Clerk authentication.

## Features

- AI-powered carousel content generation
- Supabase cloud database
- Clerk authentication (Google, Email)
- Image and video generation
- Download carousels as ZIP
- Custom branding and styling

## Setup

### Prerequisites
- Node.js 18+
- Supabase account
- Clerk account
- Gemini API access

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` file with:

```env
# Supabase
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key

# Gemini AI
GEMINI_API_KEY=your-gemini-key
```

Get credentials from:
- Supabase: Dashboard → Settings → API
- Clerk: Dashboard → API Keys
- Gemini: https://makersuite.google.com

### Database Setup

Run migration in Supabase SQL Editor:
```sql
-- Copy contents from: supabase/migrations/001_initial_schema.sql
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Deployment

See local documentation files for detailed deployment guides.

### Netlify

1. Connect GitHub repository
2. Set environment variables in Netlify dashboard
3. Deploy

### Post-Deployment

- Add your domain to Clerk dashboard
- Test authentication
- Verify database connection

## License

Private project

---

For detailed documentation, see local `.md` files (excluded from git).
