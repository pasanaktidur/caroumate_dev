const { GoogleGenAI, handleGeminiError, headers } = require('./utils');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { topic, slide, partToRegenerate, settings } = JSON.parse(event.body);
        if (!topic || !slide || !partToRegenerate || !settings || !settings.apiKey) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields or API Key for regeneration.' }) };
        }
        
        const userAi = new GoogleGenAI({ apiKey: settings.apiKey });

        const prompt = `The overall carousel topic is "${topic}". For a specific slide with the current headline "${slide.headline}" and body "${slide.body}", I need you to regenerate ONLY the ${partToRegenerate}. Provide a new, improved, and concise version of just that part. Return only the new text.`;

        const response = await userAi.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
        });
        
        const text = response.text;
        if (!text) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: 'AI returned an empty response for slide regeneration.' }) };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ newText: text.trim().replace(/^"|"$/g, '') }),
        };
    } catch (error) {
        return handleGeminiError(error);
    }
};
