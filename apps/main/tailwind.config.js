/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"../../packages/**/*.{js,ts,jsx,tsx,mdx}",
		"../../apps/**/*.{js,ts,jsx,tsx,mdx}",
		"../../**/*.stories.{js,ts,jsx,tsx,mdx}",
	],
	safelist: [
		"md:grid-cols-2",
		"bg-indigo-500", // manually safelist if purge still fails
		"bg-purple-500",
		"bg-blue-500",
		"bg-green-500",
		"bg-yellow-500",
		"bg-orange-500",
		"bg-red-500",
		"bg-gray-200",
		"bg-gray-50",
		"text-white",
		"text-gray-50",
		"text-gray-600",
		"text-gray-700",
		"text-gray-800",
		"text-gray-900",
		"hover:bg-indigo-600",
		"hover:bg-purple-600",
		"hover:bg-blue-600",
		"hover:bg-green-600",
		"hover:bg-yellow-600",
		"hover:bg-orange-600",
		"hover:bg-red-600",
		"hover:bg-gray-600",
		"hover:bg-gray-700",
		"hover:bg-gray-800",
		"hover:bg-gray-900",
		"my-masonry-grid",
		"my-masonry-grid_column",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
};
