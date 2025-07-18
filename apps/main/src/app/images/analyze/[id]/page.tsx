"use client";

import ColorThief from "colorthief";
import { ColorTreemap } from "components/ColorTreeMap";
import { quantizeImageData } from "lib/color";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const HUGGINGFACE_MODELS = [
	"facebook/detr-resnet-50",
	"google/vit-base-patch16-224",
	"microsoft/resnet-50",
];

const getImageDataFromImageElement = (
	img: HTMLImageElement,
): ImageData | null => {
	if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
		console.warn("Image not loaded or invalid dimensions.");
		return null;
	}

	const canvas = document.createElement("canvas");
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	const context = canvas.getContext("2d");
	if (!context) return null;

	context.drawImage(img, 0, 0);
	return context.getImageData(0, 0, canvas.width, canvas.height);
};

const getColorPercentages = (element: HTMLImageElement | null) => {
	// 1. Get imageData

	if (!element) return [];
	const imageData = getImageDataFromImageElement(element);

	if (!imageData) return [];

	const topColors = quantizeImageData(imageData, 20, 4); // 16 precision = more grouping
	return topColors;
};

const getRandomColor = (): string => {
	return `#${Math.floor(Math.random() * 16_777_215)
		.toString(16)
		.padStart(6, "0")}`;
};

const AnalyzePage = () => {
	const searchParameters = useSearchParams();
	const artwork = {
		imageUrl: searchParameters.get("imageUrl"),
		title: searchParameters.get("title"),
		id: searchParameters.get("id"),
		author: searchParameters.get("author"),
	};

	const [selectedModel, setSelectedModel] = useState(HUGGINGFACE_MODELS[0]);
	const [dominantColor, setDominantColor] = useState<number[] | null>(null);
	const [colorPercentages, setColorPercentages] = useState<any>(null);
	const [palette, setPalette] = useState<number[][] | null>(null);
	const imageReference = useRef<HTMLImageElement | null>(null);
	const [imageLoaded, setImageLoaded] = useState(false);

	const [analysisResult, setAnalysisResult] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const img = imageReference.current;
		if (!img) return;

		const handleLoad = () => {
			setImageLoaded(true);
		};

		if (img.complete) {
			handleLoad();
		} else {
			setImageLoaded(false);
			img.addEventListener("load", handleLoad);
			return () => img.removeEventListener("load", handleLoad);
		}
	}, []);

	useEffect(() => {
		if (!imageLoaded) return;
		const img = imageReference.current;

		const colorThief = new ColorThief();
		if (img?.complete) {
			try {
				const element = document.querySelector(
					"#artwork-image",
				) as HTMLImageElement;
				if (!element) return;
				const result = colorThief.getPalette(element, 10);
				setPalette(result);
				const color = colorThief.getColor(element, 10);
				setDominantColor(color);
				const colorAmounts = getColorPercentages(element);
				setColorPercentages(colorAmounts);
			} catch (error) {
				console.error("ColorThief failed:", error);
			}
		}
	}, [imageLoaded]);

	const colorMap: Record<string, string> = {};

	const getColorForLabel = (label: string): string => {
		if (!colorMap[label]) {
			colorMap[label] = getRandomColor();
		}
		return colorMap[label];
	};

	const handleAnalyze = async () => {
		if (!artwork.imageUrl) return;
		setLoading(true);
		try {
			const response = await fetch("/api/ai/detect-objects", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					imageUrl: artwork.imageUrl,
					modelId: selectedModel,
				}),
			});

			const result = await response.json();

			const colorCodedResult = result.map((item: any) => {
				const color = getColorForLabel(item.label);
				return {
					...item,
					color,
				};
			});
			setAnalysisResult(colorCodedResult);
		} catch (error) {
			console.error("Error analyzing image:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!artwork) return <div className="p-8">Artwork not found.</div>;

	return (
		<div className="max-w-4xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-6">
				Analyze Image: {artwork.title}
			</h1>

			{/* Next.js image for display */}
			<div className="relative inline-block mt-6">
				<img
					id={"artwork-image"}
					ref={imageReference}
					src={`/api/proxy-image?url=${encodeURIComponent(artwork.imageUrl || "")}`}
					alt="Artwork"
					className="w-full max-w-lg rounded mb-4 shadow"
					width={400}
					height={400}
				/>
				{analysisResult?.map((objectItem: any, index: number) => {
					const box = objectItem.box;

					const width = box.xmax - box.xmin;
					const height = box.ymax - box.ymin;

					if (objectItem.score < 0.9) return null;

					return (
						<div
							key={index}
							className="absolute border-2  text-xs text-white  px-1"
							style={{
								left: `${box.xmin}px`,
								top: `${box.ymin}px`,
								width: `${width}px`,
								height: `${height}px`,
								borderColor: objectItem.color,
							}}
						>
							{box.label}
						</div>
					);
				})}
			</div>
			<div>
				{analysisResult?.map((objectItem: any, index: number) => {
					const label = objectItem.label;
					const score = objectItem.score;
					if (objectItem.score < 0.9 || !label) return null;

					return (
						<div key={`analysis-${index}`}>
							<span> {label} </span>
							<span> ({score}) </span>
							<div
								key={`${objectItem.color}`}
								className="w-10 h-10 rounded"
								style={{ backgroundColor: objectItem.color }}
							/>
						</div>
					);
				})}
			</div>

			<div className="flex items-center gap-4 mb-6">
				<select
					value={selectedModel}
					onChange={(e) => setSelectedModel(e.target.value)}
					className="border rounded px-3 py-2 text-sm"
				>
					{HUGGINGFACE_MODELS.map((model) => (
						<option key={model} value={model}>
							{model}
						</option>
					))}
				</select>
				<button
					type="button"
					onClick={handleAnalyze}
					disabled={loading}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
				>
					{loading ? "Analyzing..." : "Analyze with Hugging Face"}
				</button>
			</div>

			{analysisResult && (
				<div className="mt-6">
					<h3 className="text-lg font-semibold">Model Output</h3>
					<pre className="bg-gray-100 p-4 mt-2 rounded">
						{JSON.stringify(analysisResult?.result, null, 2)}
					</pre>
				</div>
			)}

			<div className="flex gap-2 flex-wrap">
				<div
					key={`${dominantColor}`}
					className="w-20 h-20 rounded"
					style={{ backgroundColor: `rgb(${dominantColor?.join(",")})` }}
					title={`rgb(${dominantColor?.join(",")})`}
				/>
				<div>{dominantColor?.join(",")}</div>
				{/* Palette Chips */}
				{palette && (
					<div className="flex space-x-2 mt-4">
						{palette.map((color) => (
							<>
								<div
									key={`${color}`}
									className="w-10 h-10 rounded"
									style={{ backgroundColor: `rgb(${color.join(",")})` }}
									title={`rgb(${color.join(",")})`}
								/>
								<span>{color.join(",")}</span>
							</>
						))}
					</div>
				)}
			</div>

			<div className="mt-4">
				<h2>Top Colors by percentage</h2>
			</div>
			<div className="flex gap-2 flex-wrap">
				{/* Palette Chips */}
				{colorPercentages && (
					<div className=" mt-4 flex space-x-2">
						{colorPercentages.map((colorItem: any) => {
							return (
								<div key={`${colorItem.color}`}>
									<div
										className="w-10 h-10 rounded"
										style={{ backgroundColor: `${colorItem.color}` }}
										title={`${colorItem.color}`}
									/>
									<span>{colorItem.color}</span>
									<span> | {`rgb(${colorItem.rgb.join(",")})`}</span>
									<span> | {colorItem.percentage}</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
			<ColorTreemap colors={colorPercentages} />
		</div>
	);
};

export default AnalyzePage;
