import React from "react";
import { useNavigate } from "react-router-dom";

function MainNavbar() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-2 flex justify-between items-center sticky top-0 z-50">
      {/* App Name */}
      <div className="text-2xl font-bold text-gray-700">NeuroFlow</div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-8 text-gray-700 font-medium">
        <a href="/journal" className="hover:text-[#838beb] transition">
          Journal
        </a>
        <a href="/productivity" className="hover:text-[#838beb] transition">
          Productivity
        </a>
        <a href="/pomodo" className="hover:text-[#838beb] transition">
          Pomodo
        </a>
        <a href="/review" className="hover:text-[#838beb] transition">
          Review
        </a>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="bg-[#838beb] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Login
      </button>
    </nav>
  );
}

export default MainNavbar;
