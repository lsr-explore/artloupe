import React from 'react';
const PrivacyPage = () => {
	return (
		<div className="flex flex-col justify-center items-center m-10">
			<div className="w-full text-left">
				<h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
				<div className="">
					<p className="mb-4">
						Your privacy is important to us. This Privacy Policy explains how we
						collect, use, and protect your information when you use the ArtLoupe
						platform.
					</p>
				</div>

				<h2 className="text-2xl font-semibold mt-6 mb-2">
					Information We Collect
				</h2>
				<ul className="list-disc list-inside mb-4">
					<li>Basic usage data (e.g. page views, clicks, browser type)</li>
					<li>If enabled, account information (name, email)</li>
					<li>
						Uploaded images for analysis (not stored unless explicitly saved)
					</li>
				</ul>

				<h2 className="text-2xl font-semibold mt-6 mb-2">
					How We Use This Information
				</h2>
				<p className="mb-4">
					We use your information to provide and improve our services,
					personalize your experience, and ensure system integrity and
					performance.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-2">
					Third-Party Services
				</h2>
				<p className="mb-4">
					We may use third-party services (such as analytics or image models)
					that collect information subject to their own privacy policies. We do
					not sell your data to any third parties.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-2">Contact Us</h2>
				<p>
					If you have any questions or concerns about this policy, please email
					us at{" "}
					<a
						className="text-blue-600 underline"
						href="mailto:feedbac	k@artloupe.ai"
					>
						feedback@artloupe.ai
					</a>
					.
				</p>
			</div>
		</div>
	);
};

export default PrivacyPage;
