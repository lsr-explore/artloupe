"use client";

import type {  ImageType } from "@artloupe/shared-types";
import React from "react";
import { useMediaSource } from "../media-source-hook";
import { MediaLayout  } from "./media-layout";
import { ImagePanel } from "./image-panel";

export const MediaArtContainer = () => {
	const { data, isLoading, error, source } = useMediaSource();

	if (isLoading) return <p className="p-6 text-center">Loading...</p>;
	if (error)
		return (
			<p className="p-6 text-center text-red-600">Error: {error.message}</p>
		);
	
	// Handle both artworks and photos data
	if (!data) return <p className="p-6 text-center">No results found.</p>;

	const hasImages = 'images' in data && data.images && data.images.length > 0;

	console.log('ART............data', data);
	
	if (!hasImages ) {
		return <p className="p-6 text-center">No results found.</p>;
	}

	return (
		<MediaLayout
			artworks={data.images as ImageType[]}
			renderItem={(item: ImageType) =>
				<ImagePanel key={item.id} image={item} />
			}
			title={
				source === "paintings"
					? "Metropolitan Museum of Art Collection"
					: "Pexels Photo Collection"
			}
			subtitle="Discover and analyze beautiful imagery with AI"
		/>
	);
};
