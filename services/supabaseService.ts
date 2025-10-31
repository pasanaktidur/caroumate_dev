import { supabase } from '../lib/supabaseClient';
import type { UserProfile, Carousel, SlideData, AppSettings } from '../types';
import type { Database } from '../types/supabase';

type DbUser = Database['public']['Tables']['users']['Row'];
type DbCarousel = Database['public']['Tables']['carousels']['Row'];
type DbSlide = Database['public']['Tables']['slides']['Row'];
type DbSettings = Database['public']['Tables']['user_settings']['Row'];
type DbStats = Database['public']['Tables']['user_stats']['Row'];

// ==================== USER OPERATIONS ====================

export async function syncUserWithClerk(clerkUserId: string, email: string, name: string, picture?: string): Promise<string> {
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (existingUser) {
    return existingUser.id;
  }

  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      clerk_user_id: clerkUserId,
      email,
      name,
      picture: picture || null,
      profile_complete: false,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Error syncing user:', insertError);
    throw new Error('Failed to sync user with database');
  }

  // Initialize user stats
  await supabase.from('user_stats').insert({
    user_id: newUser.id,
    download_count: 0,
    carousel_count: 0,
  });

  return newUser.id;
}

export async function getUserProfile(clerkUserId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    name: data.name,
    email: data.email,
    picture: data.picture || '',
    niche: data.niche || [],
    profileComplete: data.profile_complete,
  };
}

export async function updateUserProfile(clerkUserId: string, profile: Partial<UserProfile>): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      niche: profile.niche,
      profile_complete: profile.profileComplete,
    })
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

// ==================== SETTINGS OPERATIONS ====================

export async function getUserSettings(clerkUserId: string): Promise<AppSettings | null> {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!userData) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userData.id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    aiModel: data.ai_model as any,
    apiKey: data.api_key || '',
    systemPrompt: data.system_prompt || '',
    brandKit: data.brand_kit as any,
  };
}

export async function saveUserSettings(clerkUserId: string, settings: AppSettings): Promise<void> {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!userData) throw new Error('User not found');

  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userData.id,
      ai_model: settings.aiModel,
      api_key: settings.apiKey,
      system_prompt: settings.systemPrompt,
      brand_kit: settings.brandKit as any,
    });

  if (error) {
    console.error('Error saving user settings:', error);
    throw new Error('Failed to save user settings');
  }
}

// ==================== CAROUSEL OPERATIONS ====================

export async function getCarousels(clerkUserId: string): Promise<Carousel[]> {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!userData) return [];

  const { data: carousels, error: carouselError } = await supabase
    .from('carousels')
    .select('*')
    .eq('user_id', userData.id)
    .order('created_at', { ascending: false });

  if (carouselError || !carousels) {
    return [];
  }

  const carouselsWithSlides = await Promise.all(
    carousels.map(async (carousel) => {
      const { data: slides } = await supabase
        .from('slides')
        .select('*')
        .eq('carousel_id', carousel.id)
        .order('slide_order', { ascending: true });

      return {
        id: carousel.id,
        title: carousel.title,
        createdAt: carousel.created_at,
        category: carousel.category,
        preferences: carousel.preferences as any,
        slides: (slides || []).map((slide) => ({
          id: slide.id,
          headline: slide.headline,
          body: slide.body,
          visual_prompt: slide.visual_prompt,
          backgroundColor: slide.background_color || undefined,
          fontColor: slide.font_color || undefined,
          backgroundImage: slide.background_image || undefined,
          backgroundOpacity: slide.background_opacity || undefined,
          headlineStyle: slide.headline_style as any,
          bodyStyle: slide.body_style as any,
          headlineColor: slide.headline_color || undefined,
          bodyColor: slide.body_color || undefined,
        })),
      };
    })
  );

  return carouselsWithSlides;
}

export async function saveCarousel(clerkUserId: string, carousel: Carousel): Promise<void> {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!userData) throw new Error('User not found');

  // Check if carousel exists
  const { data: existingCarousel } = await supabase
    .from('carousels')
    .select('id')
    .eq('id', carousel.id)
    .single();

  if (existingCarousel) {
    // Update existing carousel
    await supabase
      .from('carousels')
      .update({
        title: carousel.title,
        category: carousel.category,
        preferences: carousel.preferences as any,
      })
      .eq('id', carousel.id);

    // Delete old slides
    await supabase.from('slides').delete().eq('carousel_id', carousel.id);
  } else {
    // Insert new carousel
    await supabase.from('carousels').insert({
      id: carousel.id,
      user_id: userData.id,
      title: carousel.title,
      category: carousel.category,
      preferences: carousel.preferences as any,
      created_at: carousel.createdAt,
    });

    // Update carousel count
    await supabase.rpc('increment', {
      row_id: userData.id,
      table_name: 'user_stats',
      column_name: 'carousel_count',
    }).catch(() => {
      // Fallback if function doesn't exist
      supabase
        .from('user_stats')
        .update({ carousel_count: (userData as any).carousel_count + 1 })
        .eq('user_id', userData.id);
    });
  }

  // Insert slides
  const slidesData = carousel.slides.map((slide, index) => ({
    id: slide.id,
    carousel_id: carousel.id,
    slide_order: index,
    headline: slide.headline,
    body: slide.body,
    visual_prompt: slide.visual_prompt,
    background_color: slide.backgroundColor || null,
    font_color: slide.fontColor || null,
    background_image: slide.backgroundImage || null,
    background_opacity: slide.backgroundOpacity || null,
    headline_style: slide.headlineStyle as any,
    body_style: slide.bodyStyle as any,
    headline_color: slide.headlineColor || null,
    body_color: slide.bodyColor || null,
  }));

  const { error: slidesError } = await supabase.from('slides').insert(slidesData);

  if (slidesError) {
    console.error('Error saving slides:', slidesError);
    throw new Error('Failed to save carousel slides');
  }
}

export async function deleteCarousel(clerkUserId: string, carouselId: string): Promise<void> {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!userData) throw new Error('User not found');

  // Slides will be auto-deleted via CASCADE
  const { error } = await supabase
    .from('carousels')
    .delete()
    .eq('id', carouselId)
    .eq('user_id', userData.id);

  if (error) {
    console.error('Error deleting carousel:', error);
    throw new Error('Failed to delete carousel');
  }
}

// ==================== STATS OPERATIONS ====================

export async function getUserStats(clerkUserId: string): Promise<{ downloadCount: number; carouselCount: number }> {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!userData) return { downloadCount: 0, carouselCount: 0 };

  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userData.id)
    .single();

  if (!stats) {
    return { downloadCount: 0, carouselCount: 0 };
  }

  return {
    downloadCount: stats.download_count,
    carouselCount: stats.carousel_count,
  };
}

export async function incrementDownloadCount(clerkUserId: string): Promise<number> {
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!userData) throw new Error('User not found');

  const { data: currentStats } = await supabase
    .from('user_stats')
    .select('download_count')
    .eq('user_id', userData.id)
    .single();

  const newCount = (currentStats?.download_count || 0) + 1;

  await supabase
    .from('user_stats')
    .update({ download_count: newCount })
    .eq('user_id', userData.id);

  return newCount;
}

// ==================== HELPER FUNCTIONS ====================

export function isSupabaseConfigured(): boolean {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url !== 'your-project-url.supabase.co' && key !== 'your-anon-key-here');
}
