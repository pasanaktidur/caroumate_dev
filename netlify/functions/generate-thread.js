const { GoogleGenAI, handleGeminiError, headers } = require('./utils');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { carousel, settings } = JSON.parse(event.body);
        if (!carousel || !settings || !settings.apiKey) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing carousel or API Key in settings.' }) };
        }
        
        const userAi = new GoogleGenAI({ apiKey: settings.apiKey });

        const carouselContent = carousel.slides.map((s, i) => `Slide ${i+1}:\nHeadline: ${s.headline}\nBody: ${s.body}`).join('\n\n');
        const prompt = `You are an expert social media manager. Convert the following carousel content into a single, cohesive social media thread (like for Threads or X). Your response must be a single block of text. Use emojis to add personality. Combine related ideas smoothly and add natural transitions between posts. Each post in the thread should be clearly numbered (e.g., 1/5, 2/5). Start with a strong hook that makes people want to read more.\n\nCarousel Content to Convert:\n${carouselContent}`;
        
        const response = await userAi.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
        });

        const text = response.text;
        if (!text) {
             return { statusCode: 500, headers, body: JSON.stringify({ error: 'AI returned an empty response for thread generation.' }) };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ thread: text.trim() }),
        };
    } catch (error) {
        return handleGeminiError(error);
    }
};
