"use client";

import Link from "next/link";
import React, { useState } from "react";

const AIConfigPage = () => {
	const [config, setConfig] = useState({
		useOpenAI: false,
		useLocalAI: true,
		openaiApiKey: "",
		localAiUrl: "http://localhost:8080",
		model: "gpt-3.5-turbo",
		maxTokens: 200,
		temperature: 0.7,
	});

	const handleSave = () => {
		alert("Configuration saved! (Mock - not actually saved)");
	};

	const testConnection = async () => {
		alert("Connection test would run here (Mock)");
	};

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
								AI Configuration
							</h1>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white shadow rounded-lg">
						<div className="px-6 py-4 border-b border-gray-200">
							<h2 className="text-lg font-medium text-gray-900">
								AI Service Configuration
							</h2>
							<p className="mt-1 text-sm text-gray-500">
								Configure which AI service to use for artwork analysis
							</p>
						</div>

						<div className="px-6 py-4 space-y-6">
							{/* AI Service Selection */}
							<div>
								<label className="text-base font-medium text-gray-900">
									AI Service
								</label>
								<p className="text-sm leading-5 text-gray-500">
									Choose which AI service to use
								</p>
								<fieldset className="mt-4">
									<div className="space-y-4">
										<div className="flex items-center">
											<input
												id="local-ai"
												name="ai-service"
												type="radio"
												checked={config.useLocalAI}
												onChange={() =>
													setConfig({
														...config,
														useLocalAI: true,
														useOpenAI: false,
													})
												}
												className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
											/>
											<label
												htmlFor="local-ai"
												className="ml-3 block text-sm font-medium text-gray-700"
											>
												Local AI (Recommended for development)
												<span className="block text-sm text-gray-500">
													Use local AI model - no API key required
												</span>
											</label>
										</div>
										<div className="flex items-center">
											<input
												id="openai"
												name="ai-service"
												type="radio"
												checked={config.useOpenAI}
												onChange={() =>
													setConfig({
														...config,
														useOpenAI: true,
														useLocalAI: false,
													})
												}
												className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
											/>
											<label
												htmlFor="openai"
												className="ml-3 block text-sm font-medium text-gray-700"
											>
												OpenAI API
												<span className="block text-sm text-gray-500">
													Use OpenAI&apos;s GPT models - requires API key
												</span>
											</label>
										</div>
									</div>
								</fieldset>
							</div>

							{/* Local AI Configuration */}
							{config.useLocalAI && (
								<div className="border border-gray-200 rounded-lg p-4">
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Local AI Settings
									</h3>
									<div>
										<label
											htmlFor="local-url"
											className="block text-sm font-medium text-gray-700"
										>
											Local AI URL
										</label>
										<input
											type="text"
											id="local-url"
											value={config.localAiUrl}
											onChange={(error) =>
												setConfig({ ...config, localAiUrl: error.target.value })
											}
											className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
											placeholder="http://localhost:8080"
										/>
										<p className="mt-2 text-sm text-gray-500">
											URL where your local AI model is running (e.g., Ollama,
											LocalAI)
										</p>
									</div>
								</div>
							)}

							{/* OpenAI Configuration */}
							{config.useOpenAI && (
								<div className="border border-gray-200 rounded-lg p-4">
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										OpenAI Settings
									</h3>
									<div className="space-y-4">
										<div>
											<label
												htmlFor="api-key"
												className="block text-sm font-medium text-gray-700"
											>
												API Key
											</label>
											<input
												type="password"
												id="api-key"
												value={config.openaiApiKey}
												onChange={(e) =>
													setConfig({ ...config, openaiApiKey: e.target.value })
												}
												className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
												placeholder="sk-..."
											/>
										</div>
										<div>
											<label
												htmlFor="model"
												className="block text-sm font-medium text-gray-700"
											>
												Model
											</label>
											<select
												id="model"
												value={config.model}
												onChange={(error) =>
													setConfig({ ...config, model: error.target.value })
												}
												className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
											>
												<option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
												<option value="gpt-4">GPT-4</option>
												<option value="gpt-4-turbo">GPT-4 Turbo</option>
											</select>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label
													htmlFor="max-tokens"
													className="block text-sm font-medium text-gray-700"
												>
													Max Tokens
												</label>
												<input
													type="number"
													id="max-tokens"
													value={config.maxTokens}
													onChange={(error) =>
														setConfig({
															...config,
															maxTokens: Number.parseInt(error.target.value),
														})
													}
													className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
												/>
											</div>
											<div>
												<label
													htmlFor="temperature"
													className="block text-sm font-medium text-gray-700"
												>
													Temperature
												</label>
												<input
													type="number"
													id="temperature"
													step="0.1"
													min="0"
													max="2"
													value={config.temperature}
													onChange={(error) =>
														setConfig({
															...config,
															temperature: Number.parseFloat(
																error.target.value,
															),
														})
													}
													className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
												/>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Actions */}
							<div className="flex justify-between pt-6 border-t border-gray-200">
								<button
									type="button"
									onClick={testConnection}
									className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
								>
									Test Connection
								</button>
								<button
									type="button"
									onClick={handleSave}
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
								>
									Save Configuration
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default AIConfigPage;
