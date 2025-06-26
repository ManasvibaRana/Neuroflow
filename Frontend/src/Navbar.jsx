import { useState } from 'react';
import brain from "./brain.gif"
// import { useNavigate,} from "react-router-dom";

import React from "react";

function Navbar() {
  return (
    <nav className="bg-indigo-700 text-white shadow-md sticky z-50">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo / Brand */}

           <div className="flex items-center space-x-3">
          <img src={brain} alt="NeuroFlow Logo" className="h-15 w-15 object-contain rounded-full" />
          <span className="text-2xl font-bold tracking-wide">NeuroFlow</span>
        </div>
        {/* Nav Links */}
        <div className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-indigo-200 transition">
            Features
          </a>
          <a href="#journal" className="hover:text-indigo-200 transition">
            Journal
          </a>
          <a href="#dashboard" className="hover:text-indigo-200 transition">
            Dashboard
          </a>
          <a href="#contact" className="hover:text-indigo-200 transition">
            Contact
          </a>
        </div>

        {/* Call-to-Action */}
        <a
          href="/login"
          className="bg-white text-indigo-800 font-medium py-1.5 px-4 rounded-lg shadow-md hover:bg-indigo-100 transition"
        >
          Sign In
        </a>
      </div>
    </nav>
  );
}

export default Navbar;