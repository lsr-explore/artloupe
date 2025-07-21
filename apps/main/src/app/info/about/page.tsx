import React from "react";

const AboutPage = () => {
  return (
    <div className="flex flex-col justify-center items-center m-10">
      <div className="w-full text-left">
        <h1 className="text-4xl font-bold mb-4">About</h1>
        <p className="text-lg mb-6">
          Welcome to ArtLoupe – an AI-powered platform for exploring and
          analyzing visual art and photography. Our mission is to empower
          everyone from casual viewers to dedicated artists and historians to
          discover insights hidden within visual works.
        </p>
        <p className="mb-4">
          By combining publicly available datasets, computer vision models, and
          user-friendly tools, we make it easier to study composition, color,
          symbolism, and more. Whether you&apos;re an art lover, a student, or a
          creative professional, we hope ArtLoupe enhances your experience of
          visual storytelling.
        </p>
        <p>
          This project is currently under development. We welcome feedback and
          suggestions as we continue building!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
