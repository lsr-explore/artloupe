import React from 'react';
export const LoadingError = ({ error }: { error: Error }) => {
	return (
		<div className="max-w-2xl mx-auto text-center p-8">
			<div className="bg-red-50 border border-red-200 rounded-lg p-6">
				<h3 className="text-lg font-medium text-red-800 mb-2">
					Error loading artworks: {error.message}
				</h3>
				<p className="text-red-600 text-sm">{error.message}</p>
				<button
					type="button"
					onClick={() => globalThis.location.reload()}
					className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
				>
					Retry
				</button>
			</div>
		</div>
	);
};
