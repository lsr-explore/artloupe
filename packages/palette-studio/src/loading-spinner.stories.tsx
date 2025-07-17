import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LoadingSpinner } from "./loading-spinner";

const meta: Meta<typeof LoadingSpinner> = {
	title: "Components/LoadingSpinner",
	component: LoadingSpinner,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomStyling: Story = {
	decorators: [
		(Story) => (
			<div className="bg-gray-100 p-8 rounded-lg">
				<Story />
			</div>
		),
	],
};

export const InContainer: Story = {
	decorators: [
		(Story) => (
			<div className="w-96 h-48 border border-gray-300 rounded-lg">
				<Story />
			</div>
		),
	],
};
