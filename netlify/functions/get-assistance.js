const { GoogleGenAI, Type, handleGeminiError, headers } = require('./utils');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { topic, type, settings } = JSON.parse(event.body);
        if (!topic || !type || !settings || !settings.apiKey) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing topic, type, or API Key in settings.' }) };
        }
        
        const userAi = new GoogleGenAI({ apiKey: settings.apiKey });

        const prompt = type === 'hook'
            ? `Generate 5 short, catchy, and scroll-stopping hook ideas for a social media carousel about "${topic}".`
            : `Generate 5 clear and compelling call-to-action (CTA) ideas for the final slide of a social media carousel about "${topic}".`;
        
        const response = await userAi.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
            config: {
                systemInstruction: settings.systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
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
