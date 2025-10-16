const { GoogleGenAI, Modality, getSystemApiKey, handleGeminiError, headers } = require('./utils');

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { prompt, aspectRatio } = JSON.parse(event.body);
        if (!prompt || !aspectRatio) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing prompt or aspectRatio in request body.' }) };
        }
        
        const systemApiKey = getSystemApiKey();
        const systemAi = new GoogleGenAI({ apiKey: systemApiKey });
        
        const generationPrompt = `${prompt}. The image should have an aspect ratio of ${aspectRatio}.`;

        const response = await systemAi.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: generationPrompt }],
          },
          config: {
              responseModalities: [Modality.IMAGE],
          },
        });
    
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const imageBase64 = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ imageBase64, mimeType }),
            };
          }
        }
        
        console.warn('AI did not return a valid image', response);
        return { statusCode: 500, headers, body: JSON.stringify({ error: "AI did not return an image from your prompt." }) };

    } catch (error) {
        return handleGeminiError(error);
    }
};
