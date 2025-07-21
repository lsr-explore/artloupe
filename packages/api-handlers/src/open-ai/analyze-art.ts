// apps/main/src/lib/ai/generate.ts

import type { NextRequest } from 'next/server';
import { MOCK_AI_ANALYSES } from './mock-data';

interface ArtworkRequest {
  id: string;
  title: string;
  artist?: string;
  description?: string;
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: string;
}

export const analyzeArt = async (request: NextRequest): Promise<Response> => {
  const artwork = (await request.json()) as ArtworkRequest;
  if (process.env.USE_LOCAL_AI === 'true') {
    console.log(`🤖 Generating mock AI analysis for: ${artwork.title}`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return a random mock analysis
    const randomIndex = Math.floor(Math.random() * MOCK_AI_ANALYSES.length);
    return Response.json({
      result: `AI Analysis of "${artwork.title}" by ${artwork.artist}: ${MOCK_AI_ANALYSES[randomIndex]}`,
    });
  }

  const prompt = `please provide an analysis of ${artwork.title} by ${artwork.artist}, including its historical context, artistic style, and any notable features.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = (await response.json()) as OpenAIResponse;
  return Response.json({
    result: data.choices?.[0]?.message?.content || 'No response',
  });
};
