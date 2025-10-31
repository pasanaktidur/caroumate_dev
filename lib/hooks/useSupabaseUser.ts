import * as React from 'react';
import { useUser } from '@clerk/clerk-react';
import type { UserProfile, Carousel, AppSettings } from '../../types';
import {
  syncUserWithClerk,
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  saveUserSettings,
  getCarousels,
  saveCarousel,
  deleteCarousel,
  getUserStats,
  incrementDownloadCount,
  isSupabaseConfigured,
} from '../../services/supabaseService';

export function useSupabaseUser() {
  const { user: clerkUser, isLoaded } = useUser();
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [settings, setSettings] = React.useState<AppSettings | null>(null);
  const [carousels, setCarousels] = React.useState<Carousel[]>([]);
  const [downloadCount, setDownloadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const supabaseEnabled = isSupabaseConfigured();

  // Sync user with Supabase when Clerk user is loaded
  React.useEffect(() => {
    if (!isLoaded || !clerkUser || !supabaseEnabled) {
      setIsLoading(false);
      return;
    }

    const initializeUser = async () => {
      try {
        setIsLoading(true);
        
        // Sync user with Supabase
        await syncUserWithClerk(
          clerkUser.id,
          clerkUser.primaryEmailAddress?.emailAddress || '',
          clerkUser.fullName || clerkUser.username || 'User',
          clerkUser.imageUrl
        );

        // Load user profile
        const profile = await getUserProfile(clerkUser.id);
        setUserProfile(profile);

        // Load settings
        const userSettings = await getUserSettings(clerkUser.id);
        setSettings(userSettings);

        // Load carousels
        const userCarousels = await getCarousels(clerkUser.id);
        setCarousels(userCarousels);

        // Load stats
        const stats = await getUserStats(clerkUser.id);
        setDownloadCount(stats.downloadCount);

      } catch (err) {
        console.error('Error initializing user:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, [clerkUser, isLoaded, supabaseEnabled]);

  const updateProfile = React.useCallback(
    async (profile: Partial<UserProfile>) => {
      if (!clerkUser || !supabaseEnabled) return;

      try {
        await updateUserProfile(clerkUser.id, profile);
        const updatedProfile = await getUserProfile(clerkUser.id);
        setUserProfile(updatedProfile);
      } catch (err) {
        console.error('Error updating profile:', err);
        throw err;
      }
    },
    [clerkUser, supabaseEnabled]
  );

  const updateSettings = React.useCallback(
    async (newSettings: AppSettings) => {
      if (!clerkUser || !supabaseEnabled) return;

      try {
        await saveUserSettings(clerkUser.id, newSettings);
        setSettings(newSettings);
      } catch (err) {
        console.error('Error updating settings:', err);
        throw err;
      }
    },
    [clerkUser, supabaseEnabled]
  );

  const addOrUpdateCarousel = React.useCallback(
    async (carousel: Carousel) => {
      if (!clerkUser || !supabaseEnabled) return;

      try {
        await saveCarousel(clerkUser.id, carousel);
        const updatedCarousels = await getCarousels(clerkUser.id);
        setCarousels(updatedCarousels);
      } catch (err) {
        console.error('Error saving carousel:', err);
        throw err;
      }
    },
    [clerkUser, supabaseEnabled]
  );

  const removeCarousel = React.useCallback(
    async (carouselId: string) => {
      if (!clerkUser || !supabaseEnabled) return;

      try {
        await deleteCarousel(clerkUser.id, carouselId);
        setCarousels((prev) => prev.filter((c) => c.id !== carouselId));
      } catch (err) {
        console.error('Error deleting carousel:', err);
        throw err;
      }
    },
    [clerkUser, supabaseEnabled]
  );

  const incrementDownloads = React.useCallback(async () => {
    if (!clerkUser || !supabaseEnabled) return;

    try {
      const newCount = await incrementDownloadCount(clerkUser.id);
      setDownloadCount(newCount);
    } catch (err) {
      console.error('Error incrementing download count:', err);
    }
  }, [clerkUser, supabaseEnabled]);

  return {
    userProfile,
    settings,
    carousels,
    downloadCount,
    isLoading,
    error,
    supabaseEnabled,
    updateProfile,
    updateSettings,
    addOrUpdateCarousel,
    removeCarousel,
    incrementDownloads,
  };
}
