interface DetectObjectsResponse {
  error?: string;
  objects?: unknown[];
  [key: string]: unknown;
}

export const postDetectObjects = async (imageData: ArrayBuffer) => {
	if (!imageData || imageData.byteLength === 0) {
		throw new Error("Invalid image data");
	}

	const response = await fetch("/api/ai/detect-objects", {
		method: "POST",
		headers: { "Content-Type": "application/octet-stream" },
		body: imageData,
	});

	const data = (await response.json()) as DetectObjectsResponse;
	if (!response.ok) throw new Error(data.error || "Failed to detect objects");

	return data.objects;
};
