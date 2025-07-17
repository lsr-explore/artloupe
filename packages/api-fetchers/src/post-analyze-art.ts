import type { ImageType } from "@artloupe/shared-types";

export interface AnalyzeArtResponse {
  error?: string;
  result?: string;
  [key: string]: unknown;
}

export const postAnalyzeArt = async (artwork: ImageType) => {
	if (!artwork || !artwork.id || !artwork.title || !artwork.artist) {
		throw new Error("Invalid artwork data");
	}

	const response = await fetch("/api/ai/analyze", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(artwork),
	});

	const data = (await response.json()) as AnalyzeArtResponse;
	if (!response.ok) throw new Error(data.error || "Failed to analyze artwork");

	return data;
};
