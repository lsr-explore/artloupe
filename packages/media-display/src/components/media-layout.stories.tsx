import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MediaLayout, MediaLayoutProps as MediaLayoutProperties } from "./media-layout";

// Dummy artwork data
type Artwork = {
	id: string;
	title: string;
	imageUrl: string;
};

const mockArtworks: Artwork[] = [
	{
		id: "1",
		title: "Starry Night",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/640px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
	},
	{
		id: "2",
		title: "The Scream",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/f/f4/The_Scream.jpg",
	},
	{
		id: "3",
		title: "Mona Lisa",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/640px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
	},
];

// Render function for each item
const renderArtwork = (item: Artwork) => (
	<div key={item.id} className="bg-white shadow rounded p-4">
		<img
			src={item.imageUrl}
			alt={item.title}
			className="w-full h-auto object-cover rounded mb-2"
		/>
		<h3 className="text-center text-sm font-medium text-gray-700">
			{item.title}
		</h3>
	</div>
);

const meta: Meta<typeof MediaLayout<Artwork>> = {
	title: "Components/MediaLayout",
	component: MediaLayout,
};

export default meta;

type Story = StoryObj<typeof MediaLayout<Artwork>>;

export const Default: Story = {
	args: {
		artworks: mockArtworks,
		renderItem: renderArtwork,
		title: "Famous Paintings",
		subtitle: "A collection of iconic works",
	} satisfies MediaLayoutProperties<Artwork>,
};

export const EmptyState: Story = {
	args: {
		artworks: [],
		renderItem: renderArtwork,
		title: "Empty Gallery",
		emptyMessage: "There are no artworks to display.",
	} satisfies MediaLayoutProperties<Artwork>,
};
