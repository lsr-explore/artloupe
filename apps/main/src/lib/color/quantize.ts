export interface ColorCount {
	color: string; // hex format
	count: number;
	percentage: number;
}

const hexToRgb = (hex: string) => {
	let alpha = false;
	let h = hex.slice(hex.startsWith("#") ? 1 : 0);

	if (h.length === 3) h = [...h].map((x) => x + x).join("");
	else if (h.length === 8) alpha = true;

	const hNumber = Number.parseInt(h, 16);

	return [
		hNumber >>> (alpha ? 24 : 16),
		(hNumber & (alpha ? 0x00_FF_00_00 : 0x00_FF_00)) >>> (alpha ? 16 : 8),
		(hNumber & (alpha ? 0x00_00_FF_00 : 0x00_00_FF)) >>> (alpha ? 8 : 0),
		alpha ? hNumber & 0x00_00_00_FF : 0,
	];
};

// You can tune colorPrecision to group similar shades:

// 256 = no quantization (every RGB value kept as-is)

// 32 = reduces to ~30,000 distinct colors

// 8 or 4 = buckets similar tones

// This isn't as sophisticated as median cut or [k-means clustering], but it's fast and works well in browsers.
export const quantizeImageData = (
	imageData: ImageData,
	maxColors = 20,
	colorPrecision = 32, // bits per channel to keep (256 means no quantization, lower = more rounding)
): ColorCount[] => {
	const { data, width, height } = imageData;
	const totalPixels = width * height;
	const colorMap = new Map<string, number>();

	const quantize = (value: number, precision: number) => {
		const step = 256 / precision;
		return Math.floor(value / step) * step;
	};

	for (let index = 0; index < data.length; index += 4) {
		const r = data[index];
		const g = data[index + 1];
		const b = data[index + 2];
		const a = data[index + 3];
		if (a < 128) continue; // Skip transparent pixels

		// Apply quantization
		const qr = quantize(r, colorPrecision);
		const qg = quantize(g, colorPrecision);
		const qb = quantize(b, colorPrecision);

		const hex = rgbToHex(qr, qg, qb);
		colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
	}

	const entries: ColorCount[] = [...colorMap.entries()]
		.map(([color, count]) => ({
			color,
			rgb: hexToRgb(color),
			count,
			percentage: +((count / totalPixels) * 100).toFixed(2),
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, maxColors);

	return entries;
};

const rgbToHex = (r: number, g: number, b: number): string => {
	return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};
