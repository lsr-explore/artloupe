import React from "react";

const AccessibilityPage = () => {
  return (
    <div className="flex flex-col justify-center items-center m-10">
      <div className="w-full text-left">
        <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
        <p className="mb-4">
          At ArtLoupe, we are committed to ensuring digital accessibility for
          people with disabilities. We are continuously working to improve the
          user experience for everyone and apply relevant accessibility
          standards wherever possible.
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">Our Goals</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Provide keyboard-navigable interfaces</li>
          <li>Use semantic HTML and ARIA labels</li>
          <li>Support screen reader compatibility</li>
          <li>Maintain appropriate color contrast</li>
        </ul>
        <p className="mb-4">
          If you encounter any accessibility barriers or have suggestions for
          improvement, please reach out to us at{" "}
          <a
            className="text-blue-600 underline"
            href="mailto:feedback@artloupe.ai"
          >
            feedback@artloupe.ai
          </a>
          .
        </p>
        <p>
          We appreciate your feedback as we work to create an inclusive
          experience for all users.
        </p>
      </div>
    </div>
  );
};

export default AccessibilityPage;
