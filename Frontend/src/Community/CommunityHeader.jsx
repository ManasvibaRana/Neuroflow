// Frontend/src/CommunityHeader.jsx
import React from "react";

export default function CommunityHeader() {
  return (
    <header
      className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-xl p-8 md:p-12 text-white"
      style={{ backgroundImage: `url('/placeholder.svg?height=300&width=1200')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#6e68bd]/70 to-[#838beb]/70 z-0"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">Neuroflow Community</h1>
        <p className="mt-4 text-xl max-w-2xl mx-auto opacity-90">
          A sanctuary for your mind. Share your journey, find support, and cultivate inner peace together.
        </p>
      </div>
    </header>
  );
}