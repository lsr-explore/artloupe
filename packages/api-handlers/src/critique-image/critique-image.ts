import type { NextRequest } from "next/server";

interface CritiqueRequest {
  imageUrl: string;
}

interface CritiqueResponse {
  score: number;
  analysis: string;
  strengths: string[];
  areas_for_improvement: string[];
}

interface HuggingFaceResponse {
  error?: string;
  [key: string]: unknown;
}

const MOCK_CRITIQUE_RESULTS: CritiqueResponse[] = [
  {
    score: 0.92,
    analysis:
      "High compositional quality with strong focal points and balanced visual elements.",
    strengths: [
      "Strong composition",
      "Good color balance",
      "Clear focal point",
    ],
    areas_for_improvement: [
      "Could benefit from more dynamic lighting",
      "Consider rule of thirds",
    ],
  },
  {
    score: 0.85,
    analysis: "Good technical execution with room for creative enhancement.",
    strengths: ["Sharp focus", "Good exposure", "Interesting subject matter"],
    areas_for_improvement: [
      "Composition could be more dynamic",
      "Background could be less cluttered",
    ],
  },
  {
    score: 0.78,
    analysis:
      "Decent image quality with potential for improvement in several areas.",
    strengths: ["Clear subject", "Adequate lighting"],
    areas_for_improvement: [
      "Improve composition",
      "Better color grading",
      "Consider different angle",
    ],
  },
];

export const critiqueImage = async (
  request: NextRequest,
): Promise<Response> => {
  const { imageUrl } = (await request.json()) as CritiqueRequest;

  if (process.env.USE_MOCK_CRITIQUE === "true") {
    console.log("🎨 Using mock image critique data");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return a random mock result
    const randomIndex = Math.floor(
      Math.random() * MOCK_CRITIQUE_RESULTS.length,
    );
    return Response.json(MOCK_CRITIQUE_RESULTS[randomIndex]);
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/vinvino02/saliency-model",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: imageUrl }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as HuggingFaceResponse;

  // Check if the result contains an error
  if (data.error) {
    throw new Error(data.error);
  }

  return Response.json(data);
};
