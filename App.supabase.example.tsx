/**
 * EXAMPLE: App.tsx with Supabase Integration
 * 
 * This file demonstrates how to integrate Supabase with your existing App.tsx.
 * You can gradually migrate from localStorage to Supabase, or use both in parallel.
 * 
 * Key Changes:
 * 1. Import and use the useSupabaseUser hook
 * 2. Replace localStorage operations with Supabase service calls
 * 3. Handle loading states while data is being fetched
 * 4. Keep localStorage as fallback if Supabase is not configured
 */

import * as React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { useSupabaseUser } from './lib/hooks/useSupabaseUser';
import type { AppView, UserProfile, Carousel, AppSettings } from './types';

// Import your existing components
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Generator } from './components/Generator';
// ... other imports

export default function App() {
  const { user: clerkUser } = useUser();
  
  // Use Supabase hook (will fallback to localStorage if not configured)
  const {
    userProfile: supabaseProfile,
    settings: supabaseSettings,
    carousels: supabaseCarousels,
    downloadCount: supabaseDownloadCount,
    isLoading: supabaseLoading,
    supabaseEnabled,
    updateProfile,
    updateSettings,
    addOrUpdateCarousel,
    removeCarousel,
    incrementDownloads,
  } = useSupabaseUser();

  // State management - use Supabase data if available, otherwise localStorage
  const [localUser, setLocalUser] = React.useState<UserProfile | null>(null);
  const [localCarousels, setLocalCarousels] = React.useState<Carousel[]>([]);
  const [localSettings, setLocalSettings] = React.useState<AppSettings | null>(null);
  const [localDownloadCount, setLocalDownloadCount] = React.useState(0);

  // Determine which data source to use
  const user = supabaseEnabled ? supabaseProfile : localUser;
  const carouselHistory = supabaseEnabled ? supabaseCarousels : localCarousels;
  const settings = supabaseEnabled ? supabaseSettings : localSettings;
  const downloadCount = supabaseEnabled ? supabaseDownloadCount : localDownloadCount;

  // Load localStorage data if Supabase is not configured
  React.useEffect(() => {
    if (!supabaseEnabled) {
      // Load from localStorage (your existing logic)
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setLocalUser(JSON.parse(savedUser));

        const savedCarousels = localStorage.getItem('carouselHistory');
        if (savedCarousels) setLocalCarousels(JSON.parse(savedCarousels));

        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) setLocalSettings(JSON.parse(savedSettings));

        const savedDownloads = localStorage.getItem('downloadCount');
        if (savedDownloads) setLocalDownloadCount(JSON.parse(savedDownloads));
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }, [supabaseEnabled]);

  // Handle profile setup/update
  const handleProfileSetup = async (profile: Omit<UserProfile, 'profileComplete'>) => {
    const updatedProfile = { ...profile, profileComplete: true };
    
    if (supabaseEnabled && clerkUser) {
      try {
        await updateProfile(updatedProfile);
      } catch (error) {
        console.error('Failed to save profile to Supabase:', error);
      }
    } else {
      setLocalUser(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
    }
  };

  // Handle settings save
  const handleSaveSettings = async (newSettings: AppSettings) => {
    if (supabaseEnabled && clerkUser) {
      try {
        await updateSettings(newSettings);
      } catch (error) {
        console.error('Failed to save settings to Supabase:', error);
      }
    } else {
      setLocalSettings(newSettings);
      localStorage.setItem('settings', JSON.stringify(newSettings));
    }
  };

  // Handle carousel generation/update
  const handleCarouselUpdate = async (carousel: Carousel) => {
    if (supabaseEnabled && clerkUser) {
      try {
        await addOrUpdateCarousel(carousel);
      } catch (error) {
        console.error('Failed to save carousel to Supabase:', error);
      }
    } else {
      setLocalCarousels((prev) => {
        const index = prev.findIndex((c) => c.id === carousel.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = carousel;
          localStorage.setItem('carouselHistory', JSON.stringify(updated));
          return updated;
        } else {
          const updated = [carousel, ...prev];
          localStorage.setItem('carouselHistory', JSON.stringify(updated));
          return updated;
        }
      });
    }
  };

  // Handle carousel deletion
  const handleDeleteCarousel = async (carouselId: string) => {
    if (window.confirm('Are you sure you want to delete this carousel?')) {
      if (supabaseEnabled && clerkUser) {
        try {
          await removeCarousel(carouselId);
        } catch (error) {
          console.error('Failed to delete carousel from Supabase:', error);
        }
      } else {
        setLocalCarousels((prev) => {
          const updated = prev.filter((c) => c.id !== carouselId);
          localStorage.setItem('carouselHistory', JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  // Handle download count increment
  const handleDownload = async () => {
    if (supabaseEnabled && clerkUser) {
      try {
        await incrementDownloads();
      } catch (error) {
        console.error('Failed to increment download count:', error);
      }
    } else {
      const newCount = localDownloadCount + 1;
      setLocalDownloadCount(newCount);
      localStorage.setItem('downloadCount', JSON.stringify(newCount));
    }
  };

  // Show loading state while Supabase is initializing
  if (supabaseEnabled && supabaseLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Show connection status */}
      {supabaseEnabled && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-4 py-2 text-sm text-center">
          ✓ Connected to Supabase - Your data is synced
        </div>
      )}
      {!supabaseEnabled && (
        <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 px-4 py-2 text-sm text-center">
          ⚠ Using local storage - Configure Supabase for cloud sync
        </div>
      )}

      {/* Your existing app content */}
      <header className="p-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <main className="flex-grow">
        {/* Your existing components with the new handlers */}
        {/* 
        <Dashboard 
          onNewCarousel={...}
          history={carouselHistory}
          onEdit={...}
          onDelete={handleDeleteCarousel}
          downloadCount={downloadCount}
        />
        */}
      </main>
    </div>
  );
}

/**
 * MIGRATION STRATEGY:
 * 
 * 1. GRADUAL MIGRATION (Recommended):
 *    - Keep localStorage logic intact
 *    - Add Supabase alongside it
 *    - Use feature flags to switch between them
 *    - Test thoroughly before full switch
 * 
 * 2. IMMEDIATE SWITCH:
 *    - Replace all localStorage calls with Supabase
 *    - Remove localStorage logic entirely
 *    - Ensure all users have configured Supabase
 * 
 * 3. HYBRID APPROACH:
 *    - Use Supabase for main data
 *    - Keep localStorage for caching
 *    - Sync on app load/save
 */
