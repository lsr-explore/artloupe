"use client";

import type { ImageType } from "@artloupe/shared-types";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminArtworks } from "lib/api/artworks";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ArtworksPage = () => {
	const [expandedAnalysis, setExpandedAnalysis] = useState<
		string | undefined
	>();
	const [analyzingId, setAnalyzingId] = useState<string | undefined>();
	// const [, setAnalyzeResults] = useState<string | undefined>();

	const { data, isLoading, error } = useQuery({
		queryKey: ["admin-artworks"],
		queryFn: fetchAdminArtworks,
	});

	const handleAnalyze = async (artworkId: string) => {
		setAnalyzingId(artworkId);
		// await analyzeArtwork({ variables: { id: artworkId } });
	};

	const toggleAnalysis = (artworkId: string) => {
		setExpandedAnalysis(expandedAnalysis === artworkId ? undefined : artworkId);
	};

	if (isLoading) return <div className="p-8">Loading artworks...</div>;
	if (error)
		return <div className="p-8 text-red-500">Error: {error.message}</div>;

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div className="flex items-center">
							<Link href="/" className="text-blue-500 hover:text-blue-700 mr-4">
								← Back to Dashboard
							</Link>
							<h1 className="text-3xl font-bold text-gray-900">
								Artwork Management
							</h1>
						</div>
						<div className="text-sm text-gray-500">
							{data?.images?.length || 0} artworks total
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white shadow overflow-hidden sm:rounded-md">
						<ul className="divide-y divide-gray-200">
							{data?.images?.map((artwork: any) => (
								<li key={artwork.id}>
									<div className="px-4 py-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center">
												{artwork.imageUrl && (
													<Image
														className="h-16 w-16 rounded-lg object-cover"
														src={artwork.imageUrl}
														alt={artwork.title}
													/>
												)}
												<div className="ml-4">
													<div className="text-sm font-medium text-gray-900">
														{artwork.title}
													</div>
													<div className="text-sm text-gray-500">
														{artwork.artist}
													</div>
													<div className="text-xs text-gray-400 mt-1">
														ID: {artwork.id} | {artwork.description}
													</div>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												{artwork.aiAnalysis ? (
													<>
														<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
															AI Analyzed
														</span>
														<button
															type="button"
															onClick={() => toggleAnalysis(artwork.id)}
															className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
														>
															{expandedAnalysis === artwork.id
																? "Hide Analysis"
																: "View Analysis"}
														</button>
													</>
												) : (
													<button
														type="button"
														onClick={() => handleAnalyze(artwork.id)}
														disabled={analyzingId === artwork.id}
														className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
													>
														{analyzingId === artwork.id
															? "Analyzing..."
															: "Run AI Analysis"}
													</button>
												)}
												<button
													type="button"
													className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
												>
													Edit
												</button>
											</div>
										</div>

										{artwork.aiAnalysis && expandedAnalysis === artwork.id && (
											<div className="mt-4 p-4 bg-gray-50 rounded-lg">
												<h4 className="text-sm font-medium text-gray-900 mb-2">
													AI Analysis:
												</h4>
												<p className="text-sm text-gray-700 leading-relaxed">
													{artwork.aiAnalysis}
												</p>
											</div>
										)}
									</div>
								</li>
							))}
						</ul>
					</div>

					{/* Bulk Actions */}
					<div className="mt-6 bg-white p-4 rounded-lg shadow">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Bulk Actions
						</h3>
						<div className="flex space-x-4">
							<button
								type="button"
								onClick={() => {
									const unanalyzedArtworks =
										data?.images?.filter((art: ImageType) => !art.aiAnalysis) ||
										[];
									for (const artwork of unanalyzedArtworks) {
										setTimeout(
											() => handleAnalyze(artwork.id),
											Math.random() * 2000,
										);
									}
								}}
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
							>
								Analyze All Unanalyzed Artworks
							</button>
							<button
								type="button"
								className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							>
								Export Data
							</button>
							<button
								type="button"
								className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							>
								Refresh from API
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ArtworksPage;
