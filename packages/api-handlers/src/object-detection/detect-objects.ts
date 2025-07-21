import type { NextRequest } from "next/server";

interface DetectionRequest {
  imageUrl: string;
  modelId: string;
}

interface DetectionObject {
  label: string;
  score: number;
  box: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}

interface HuggingFaceResponse {
  error?: string;
  [key: string]: unknown;
}

const MOCK_OBJECT_DETECTION_RESULTS: DetectionObject[][] = [
  [
    {
      label: "person",
      score: 0.95,
      box: { xmin: 100, ymin: 50, xmax: 200, ymax: 300 },
    },
    {
      label: "car",
      score: 0.87,
      box: { xmin: 300, ymin: 200, xmax: 500, ymax: 400 },
    },
  ],
  [
    {
      label: "dog",
      score: 0.92,
      box: { xmin: 150, ymin: 100, xmax: 250, ymax: 250 },
    },
    {
      label: "tree",
      score: 0.78,
      box: { xmin: 50, ymin: 10, xmax: 150, ymax: 300 },
    },
  ],
  [
    {
      label: "building",
      score: 0.89,
      box: { xmin: 0, ymin: 0, xmax: 400, ymax: 300 },
    },
    {
      label: "window",
      score: 0.82,
      box: { xmin: 100, ymin: 50, xmax: 150, ymax: 100 },
    },
  ],
];

export const detectObjects = async (
  request: NextRequest,
): Promise<Response> => {
  const { imageUrl, modelId } = (await request.json()) as DetectionRequest;

  if (process.env.USE_MOCK_DETECTION === "true") {
    console.log("🔍 Using mock object detection data");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a random mock result
    const randomIndex = Math.floor(
      Math.random() * MOCK_OBJECT_DETECTION_RESULTS.length,
    );
    return Response.json(MOCK_OBJECT_DETECTION_RESULTS[randomIndex]);
  }

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${modelId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ inputs: imageUrl }),
    },
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: `HTTP error! status: ${response.status}` }),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const result = (await response.json()) as HuggingFaceResponse;

  // Check if the result contains an error
  if (result.error) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return Response.json(result);
};
