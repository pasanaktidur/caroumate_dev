const { GoogleGenAI, Type, Modality } = require('@google/genai');
require('dotenv').config();

// --- System API Key Pool for Image Generation ---
const systemApiKeys = (process.env.SYSTEM_API_KEYS || '').split(',').map(k => k.trim()).filter(Boolean);
if (systemApiKeys.length === 0) {
    console.warn('WARNING: `SYSTEM_API_KEYS` environment variable is not set or empty. Image generation will fail.');
}
let currentSystemApiKeyIndex = 0;

/**
 * Gets the next available system API key from the pool in a round-robin fashion.
 * @returns {string} The selected API key.
 * @throws {Error} If no system API keys are configured.
 */
const getSystemApiKey = () => {
    if (systemApiKeys.length === 0) {
        throw new Error('No system API keys are configured on the server for image generation.');
    }
    const key = systemApiKeys[currentSystemApiKeyIndex];
    currentSystemApiKeyIndex = (currentSystemApiKeyIndex + 1) % systemApiKeys.length;
    return key;
};

// Helper to handle Gemini API errors gracefully and format for Netlify Functions response
const handleGeminiError = (error) => {
    console.error('Gemini API Error:', error);
    let errorMessage = 'Failed to communicate with AI model.';
    let statusCode = 500;

    if (error.message) {
        const lowerCaseMessage = error.message.toLowerCase();
        if (lowerCaseMessage.includes('api key not valid') || lowerCaseMessage.includes('permission denied')) {
            errorMessage = 'An API Key being used is invalid or missing permissions.';
            statusCode = 401;
        } else if (lowerCaseMessage.includes('quota')) {
            errorMessage = 'API quota exceeded. Please check your usage.';
            statusCode = 429;
        } else {
            errorMessage = error.message;
        }
    }
    
    return {
        statusCode,
        headers,
        body: JSON.stringify({ error: errorMessage, details: error.message }),
    };
};

// Helper for CORS headers
const headers = {
    'Access-Control-Allow-Origin': '*', // Allows requests from any origin
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

module.exports = {
    GoogleGenAI,
    Type,
    Modality,
    getSystemApiKey,
    handleGeminiError,
    headers,
};
