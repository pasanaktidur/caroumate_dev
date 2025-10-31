# Supabase Quick Reference

## 🎯 Common Operations

### Initialize User on First Login

```tsx
import { useSupabaseUser } from './lib/hooks/useSupabaseUser';

function App() {
  const { userProfile, isLoading } = useSupabaseUser();
  
  // User is automatically synced when they sign in via Clerk
  // No manual initialization needed!
}
```

### Save a Carousel

```tsx
const { addOrUpdateCarousel } = useSupabaseUser();

const handleGenerate = async (carousel: Carousel) => {
  await addOrUpdateCarousel(carousel);
};
```

### Load All Carousels

```tsx
const { carousels, isLoading } = useSupabaseUser();

if (isLoading) return <Spinner />;

return (
  <div>
    {carousels.map(carousel => (
      <CarouselCard key={carousel.id} data={carousel} />
    ))}
  </div>
);
```

### Update User Settings

```tsx
const { settings, updateSettings } = useSupabaseUser();

const handleSaveSettings = async (newSettings: AppSettings) => {
  await updateSettings(newSettings);
};
```

### Delete a Carousel

```tsx
const { removeCarousel } = useSupabaseUser();

const handleDelete = async (carouselId: string) => {
  if (confirm('Delete this carousel?')) {
    await removeCarousel(carouselId);
  }
};
```

### Track Downloads

```tsx
const { downloadCount, incrementDownloads } = useSupabaseUser();

const handleDownload = async () => {
  // ... download logic
  await incrementDownloads();
};
```

## 🔧 Direct Service Usage

When you need more control:

```tsx
import {
  getUserProfile,
  saveCarousel,
  getCarousels,
} from './services/supabaseService';
import { useUser } from '@clerk/clerk-react';

function MyComponent() {
  const { user } = useUser();
  
  const loadData = async () => {
    if (!user) return;
    
    const profile = await getUserProfile(user.id);
    const carousels = await getCarousels(user.id);
    
    console.log(profile, carousels);
  };
  
  const saveData = async (carousel: Carousel) => {
    if (!user) return;
    await saveCarousel(user.id, carousel);
  };
}
```

## 🎨 Check Supabase Status

```tsx
import { isSupabaseConfigured } from './services/supabaseService';

function App() {
  const supabaseEnabled = isSupabaseConfigured();
  
  return (
    <div>
      {supabaseEnabled ? (
        <span>✓ Connected to Supabase</span>
      ) : (
        <span>⚠ Using localStorage</span>
      )}
    </div>
  );
}
```

## 🚦 Error Handling

```tsx
const { addOrUpdateCarousel } = useSupabaseUser();

const handleSave = async (carousel: Carousel) => {
  try {
    await addOrUpdateCarousel(carousel);
    toast.success('Saved!');
  } catch (error) {
    console.error('Save failed:', error);
    toast.error('Failed to save. Please try again.');
  }
};
```

## 📊 Loading States

```tsx
const { carousels, isLoading, error } = useSupabaseUser();

if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage message={error} />;
}

return <CarouselList data={carousels} />;
```

## 🔄 Fallback to localStorage

```tsx
import { useSupabaseUser } from './lib/hooks/useSupabaseUser';

function App() {
  const supabase = useSupabaseUser();
  const [localData, setLocalData] = useState(null);
  
  // Use Supabase if available, otherwise localStorage
  const data = supabase.supabaseEnabled 
    ? supabase.carousels 
    : localData;
}
```

## 📝 TypeScript Types

```tsx
import type { 
  UserProfile, 
  Carousel, 
  SlideData, 
  AppSettings,
  DesignPreferences 
} from './types';

import type { Database } from './types/supabase';

// Use Database types for direct Supabase queries
type CarouselRow = Database['public']['Tables']['carousels']['Row'];
```

## 🎯 Best Practices

### 1. Always Check User Authentication

```tsx
const { user } = useUser();
if (!user) return <LoginScreen />;
```

### 2. Handle Async Operations

```tsx
const [isSaving, setIsSaving] = useState(false);

const handleSave = async () => {
  setIsSaving(true);
  try {
    await addOrUpdateCarousel(carousel);
  } finally {
    setIsSaving(false);
  }
};
```

### 3. Debounce Auto-Save

```tsx
import { debounce } from 'lodash';

const debouncedSave = debounce(
  (carousel: Carousel) => addOrUpdateCarousel(carousel),
  1000
);

// Call on every change
debouncedSave(currentCarousel);
```

### 4. Optimistic Updates

```tsx
// Update UI immediately
setCarousels(prev => [...prev, newCarousel]);

// Sync to database
addOrUpdateCarousel(newCarousel).catch(() => {
  // Revert on error
  setCarousels(prev => prev.filter(c => c.id !== newCarousel.id));
  toast.error('Save failed');
});
```

## 🔍 Debugging Tips

### Check Connection

```tsx
import { supabase } from './lib/supabaseClient';

const testConnection = async () => {
  const { data, error } = await supabase.from('users').select('count');
  console.log('Connection test:', { data, error });
};
```

### View Current User

```tsx
const { data: { session } } = await supabase.auth.getSession();
console.log('Current session:', session);
```

### Check RLS Policies

```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'carousels';
```

## 📦 Environment Variables

Required in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
GEMINI_API_KEY=...
```

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Common Errors

| Error | Solution |
|-------|----------|
| "Failed to load user data" | Check environment variables |
| "RLS policy violation" | Verify Clerk user is authenticated |
| "User not found" | Ensure user synced via `syncUserWithClerk` |
| "Failed to save" | Check Supabase logs in dashboard |

---

**Need more help?** Check `IMPLEMENTATION_GUIDE.md` or `SUPABASE_SETUP.md`
