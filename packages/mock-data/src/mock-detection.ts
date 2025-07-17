
export const mockDetectionResult = {
	objects: [
		{
			label: "person",
			score: 0.95,
			box: { xmin: 100, ymin: 50, xmax: 200, ymax: 300 },
		},
		{
			label: "car",
			score: 0.87,
			box: { xmin: 300, ymin: 150, xmax: 500, ymax: 250 },
		},
	],
};
export const mockObjectDetectionResponse = {
	detected_objects: [
		{
			label: "person",
			confidence: 0.95,
			bounding_box: {
				x: 100,
				y: 100,
				width: 200,
				height: 300,
			},
		},
	],
}; 