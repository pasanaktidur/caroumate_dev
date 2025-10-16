import type { DesignPreferences, SlideData, AppSettings, AspectRatio, Carousel } from '../types';

const API_BASE_URL = '/api';

/**
 * A helper function to make POST requests to the backend API.
 * It centralizes fetch logic, error handling, and JSON parsing.
 * @param endpoint The API endpoint to call (e.g., '/generate-content').
 * @param body The request body to send as JSON.
 * @returns The JSON response from the backend.
 */
async function apiRequest(endpoint: string, body: object) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            let errorMsg = `HTTP error! status: ${response.status}`;
            try {
                // Try to parse error response as JSON, as our functions should return this format
                const errorData = await response.json();
                errorMsg = errorData.error || JSON.stringify(errorData);
            } catch (e) {
                // If parsing fails, use the raw text response
                try {
                   errorMsg = await response.text();
                } catch(textErr){
                    // Could not even get text, stick with the original status code message.
                }
            }
            throw new Error(errorMsg);
        }

        return await response.json();
    } catch (error: any) {
        console.error(`API request to ${endpoint} failed:`, error);
        // Rethrow the error to be handled by the UI
        throw error;
    }
}


// --- Service Functions (Now calling the backend) ---

export const generateCarouselContent = async (
    topic: string,
    niche: string,
    preferences: DesignPreferences,
    settings: AppSettings,
): Promise<Omit<SlideData, 'id'>[]> => {
    return apiRequest('/generate-content', { topic, niche, preferences, settings });
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio, settings: AppSettings): Promise<string> => {
    // The user's settings (and API key) are intentionally not sent for image generation.
    // The backend will use its own pool of system keys.
    const { imageBase64, mimeType } = await apiRequest('/generate-image', { prompt, aspectRatio });
    return `data:${mimeType};base64,${imageBase64}`;
};

export const getAiAssistance = async (topic: string, type: 'hook' | 'cta', settings: AppSettings): Promise<string[]> => {
    return apiRequest('/get-assistance', { topic, type, settings });
};

export const generateCaption = async (carousel: Carousel, settings: AppSettings): Promise<string> => {
    const { caption } = await apiRequest('/generate-caption', { carousel, settings });
    return caption;
};

export const regenerateSlideContent = async (topic: string, slide: SlideData, partToRegenerate: 'headline' | 'body', settings: AppSettings): Promise<string> => {
    const { newText } = await apiRequest('/regenerate-slide', { topic, slide, partToRegenerate, settings });
    return newText;
};

export const generateThreadFromCarousel = async (carousel: Carousel, settings: AppSettings): Promise<string> => {
    const { thread } = await apiRequest('/generate-thread', { carousel, settings });
    return thread;
};
