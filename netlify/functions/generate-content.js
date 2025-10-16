const { GoogleGenAI, Type, handleGeminiError, headers } = require('./utils');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { topic, niche, preferences, settings } = JSON.parse(event.body);
        if (!topic || !niche || !preferences || !settings || !settings.apiKey) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields or API Key in request body.' }) };
        }
        
        const userAi = new GoogleGenAI({ apiKey: settings.apiKey });

        const slideSchema = {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                body: { type: Type.STRING },
                visual_prompt: { type: Type.STRING, description: "A creative, descriptive prompt for an AI image generator (e.g., DALL-E, Midjourney) to create a visual for this slide. Should be in English." },
            },
            required: ['headline', 'body', 'visual_prompt']
        };

        const prompt = `Create a social media carousel content plan. The main topic is "${topic}". The target audience or niche is "${niche}". The desired content style is "${preferences.style}". Generate between 5 to 7 slides. Each slide must have a 'headline', a 'body', and a 'visual_prompt'. The first slide must be a very strong hook to grab attention. The last slide must be a clear call to action. The tone should be engaging, informative, and tailored to the niche.`;
        
        const response = await userAi.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
            config: {
                systemInstruction: settings.systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: slideSchema
                },
            },
        });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(JSON.parse(response.text.trim())),
        };
    } catch (error) {
        return handleGeminiError(error);
    }
};
