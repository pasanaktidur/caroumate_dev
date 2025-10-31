# Supabase Implementation Guide

## 📁 File Structure Overview

```
Caroumate_login/
├── .env.local                              # Environment variables (Supabase credentials)
├── lib/
│   ├── supabaseClient.ts                   # Supabase client initialization
│   └── hooks/
│       └── useSupabaseUser.ts              # React hook for Supabase operations
├── services/
│   └── supabaseService.ts                  # Core database operations (CRUD)
├── types/
│   └── supabase.ts                         # TypeScript types for database schema
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql          # Database schema and RLS policies
├── App.supabase.example.tsx                # Example implementation
├── SUPABASE_SETUP.md                       # Setup instructions
└── IMPLEMENTATION_GUIDE.md                 # This file
```

## 🚀 Quick Start

### 1. Install Dependencies (Already Done)
```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables

Edit `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Set Up Supabase Database

1. Create a Supabase project at https://supabase.com
2. Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
3. Verify tables are created in the Supabase dashboard

### 4. Integrate into Your App

Choose one of these approaches:

#### Option A: Use the Custom Hook (Recommended)

```tsx
import { useSupabaseUser } from './lib/hooks/useSupabaseUser';

function App() {
  const {
    userProfile,
    settings,
    carousels,
    downloadCount,
    isLoading,
    updateProfile,
    updateSettings,
    addOrUpdateCarousel,
    removeCarousel,
    incrementDownloads,
  } = useSupabaseUser();

  // Use these values and functions in your app
  if (isLoading) return <LoadingScreen />;
  
  return <Dashboard carousels={carousels} />;
}
```

#### Option B: Use Services Directly

```tsx
import {
  getUserProfile,
  saveUserSettings,
  getCarousels,
  saveCarousel,
} from './services/supabaseService';

// In your component
const profile = await getUserProfile(clerkUserId);
await saveCarousel(clerkUserId, carouselData);
```

## 📚 API Reference

### useSupabaseUser Hook

The main hook for interacting with Supabase data.

**Returns:**
```typescript
{
  userProfile: UserProfile | null;
  settings: AppSettings | null;
  carousels: Carousel[];
  downloadCount: number;
  isLoading: boolean;
  error: string | null;
  supabaseEnabled: boolean;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  addOrUpdateCarousel: (carousel: Carousel) => Promise<void>;
  removeCarousel: (carouselId: string) => Promise<void>;
  incrementDownloads: () => Promise<void>;
}
```

**Usage Example:**
```tsx
const { carousels, addOrUpdateCarousel, isLoading } = useSupabaseUser();

const handleSave = async (carousel: Carousel) => {
  await addOrUpdateCarousel(carousel);
  console.log('Carousel saved to Supabase!');
};
```

### Supabase Service Functions

Low-level functions for direct database access.

#### User Operations
- `syncUserWithClerk(clerkUserId, email, name, picture?)` - Sync Clerk user to Supabase
- `getUserProfile(clerkUserId)` - Get user profile
- `updateUserProfile(clerkUserId, profile)` - Update user profile

#### Settings Operations
- `getUserSettings(clerkUserId)` - Get user settings
- `saveUserSettings(clerkUserId, settings)` - Save user settings

#### Carousel Operations
- `getCarousels(clerkUserId)` - Get all user carousels
- `saveCarousel(clerkUserId, carousel)` - Save/update carousel
- `deleteCarousel(clerkUserId, carouselId)` - Delete carousel

#### Stats Operations
- `getUserStats(clerkUserId)` - Get user statistics
- `incrementDownloadCount(clerkUserId)` - Increment download count

#### Utility
- `isSupabaseConfigured()` - Check if Supabase is configured

## 🔄 Migration from localStorage

### Strategy 1: Parallel Running (Safest)

Keep both localStorage and Supabase, choose based on configuration:

```tsx
const supabaseEnabled = isSupabaseConfigured();
const data = supabaseEnabled ? supabaseData : localStorageData;
```

See `App.supabase.example.tsx` for full implementation.

### Strategy 2: Data Migration Script

Create a one-time migration:

```tsx
const migrateToSupabase = async () => {
  const localUser = JSON.parse(localStorage.getItem('user') || 'null');
  const localCarousels = JSON.parse(localStorage.getItem('carouselHistory') || '[]');
  
  if (localUser && clerkUser) {
    await updateUserProfile(clerkUser.id, localUser);
  }
  
  for (const carousel of localCarousels) {
    await saveCarousel(clerkUser.id, carousel);
  }
  
  // Clear localStorage after successful migration
  localStorage.clear();
};
```

### Strategy 3: Direct Replacement

Replace all localStorage calls with Supabase calls:

```tsx
// Before
localStorage.setItem('carouselHistory', JSON.stringify(carousels));

// After
await addOrUpdateCarousel(carousel);
```

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Authentication via Clerk JWT tokens
- Automatic user isolation

### Data Privacy

- API keys stored encrypted in user_settings
- Images/videos can be stored as base64 (consider using Supabase Storage for large files)
- All operations scoped to authenticated user

## 🎨 Database Schema

### Tables

**users**
- User profiles synced from Clerk
- Fields: clerk_user_id, email, name, picture, niche[], profile_complete

**user_settings**
- User app settings and preferences
- Fields: ai_model, api_key, system_prompt, brand_kit (JSONB)

**user_stats**
- User activity statistics
- Fields: download_count, carousel_count

**carousels**
- Carousel metadata
- Fields: title, category, preferences (JSONB)

**slides**
- Individual slide content
- Fields: headline, body, visual_prompt, styling options
- Related to carousels via carousel_id

## 🧪 Testing

### Manual Testing Checklist

- [ ] User profile loads correctly
- [ ] Settings save and load
- [ ] Carousel creation works
- [ ] Carousel editing persists
- [ ] Carousel deletion works
- [ ] Download count increments
- [ ] Multi-device sync works
- [ ] Data survives browser refresh

### Test Commands

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Common Issues

**"Failed to load user data"**
- Check environment variables are set correctly
- Verify Supabase project is active
- Check browser console for detailed errors

**RLS Policy Violations**
- Ensure Clerk user is properly authenticated
- Check that JWT token includes user ID
- Verify RLS policies in Supabase dashboard

**Data Not Syncing**
- Check network tab for failed requests
- Verify Supabase URL and API key
- Check Supabase logs in dashboard

**TypeScript Errors**
- Run `npm install` to ensure @supabase/supabase-js is installed
- Check that types/supabase.ts matches your actual schema
- Restart TypeScript server in VSCode

## 📊 Performance Optimization

### Best Practices

1. **Debounce Saves**: Don't save on every keystroke
```tsx
const debouncedSave = debounce(saveCarousel, 1000);
```

2. **Optimistic Updates**: Update UI immediately, sync in background
```tsx
setLocalState(newValue);
saveToSupabase(newValue).catch(() => setLocalState(oldValue));
```

3. **Pagination**: Load carousels in batches
```tsx
const { data } = await supabase
  .from('carousels')
  .select('*')
  .range(0, 9)  // First 10 items
  .order('created_at', { ascending: false });
```

4. **Caching**: Use React Query or SWR for automatic caching

## 🔮 Future Enhancements

### Recommended Features

1. **Real-time Sync**
```tsx
supabase
  .channel('carousels')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'carousels' 
  }, handleChange)
  .subscribe();
```

2. **Supabase Storage for Media**
- Store images/videos in Supabase Storage instead of base64
- Reduces database size
- Faster loading times

3. **Collaboration Features**
- Share carousels with other users
- Add permissions table
- Real-time editing

4. **Analytics**
- Track carousel views
- Popular templates
- Usage patterns

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **Issues**: Open an issue in your repository

## ✅ Checklist for Production

- [ ] Environment variables set in production
- [ ] Database migration run on production Supabase project
- [ ] RLS policies tested and verified
- [ ] Backup strategy in place
- [ ] Error monitoring configured (Sentry, etc.)
- [ ] Performance monitoring enabled
- [ ] Rate limiting configured (if needed)
- [ ] CORS settings configured in Supabase

---

**Last Updated**: 2025-10-31  
**Version**: 1.0.0
