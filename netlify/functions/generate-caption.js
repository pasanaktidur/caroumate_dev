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

        const carouselContent = carousel.slides.map((s, i) => `Slide ${i+1}: Headline: ${s.headline}, Body: ${s.body}`).join('\n');
        const prompt = `You are an expert social media manager. Based on the following carousel content, write an engaging and compelling caption for a social media post (like Instagram or LinkedIn). The caption should summarize the key points and encourage engagement (e.g., asking a question). After the main caption, add a blank line, and then provide exactly 3 relevant, viral hashtags on a new line.\n\nCarousel Content:\n${carouselContent}`;
        
        const response = await userAi.models.generateContent({
            model: settings.aiModel,
            contents: prompt,
            config: {
                systemInstruction: settings.systemPrompt,
            },
        });

        const text = response.text;
        if (!text) {
             return { statusCode: 500, headers, body: JSON.stringify({ error: 'AI returned an empty response for caption generation.' }) };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ caption: text.trim() }),
        };
    } catch (error) {
        return handleGeminiError(error);
    }
};
