import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function MainNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userid, setUserid] = useState("");
  const [streak, setStreak] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userid");
    const storedStreak = sessionStorage.getItem("streak"); // optional
    if (storedUser) {
      setIsLoggedIn(true);
      setUserid(storedUser);
      setStreak(storedStreak || 0);
    }
  }, []);

  const handleLogin = () => {
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* App Name */}
      <div
        onClick={() => {
          navigate("/journal");
          setMenuOpen(false);
        }}
        className="text-2xl font-bold text-gray-700 cursor-pointer"
      >
        NeuroFlow
      </div>

      {/* Centered Nav Links (Desktop) */}
      <div className="hidden md:flex gap-8 text-gray-700 font-medium items-center absolute left-1/2 transform -translate-x-1/2">
        <a href="/journal" className="hover:text-[#838beb] transition">
          Journal
        </a>
        <a href="/productivity" className="hover:text-[#838beb] transition">
          Productivity
        </a>
        <a href="/analysis" className="hover:text-[#838beb] transition">
          Analysis
        </a>
        <a href="/pomodo" className="hover:text-[#838beb] transition">
          Pomodoro
        </a>
        <a href="/activity" className="hover:text-[#838beb] transition">
          Activity
        </a>
        <a href="/review" className="hover:text-[#838beb] transition">
          Review
        </a>
      </div>

      {/* Right Section: Login/Profile */}
      <div className="flex items-center gap-6">
        {isLoggedIn && (
          <div className="text-sm text-gray-600 font-semibold  md:block">
            🔥 <span className="text-black">{streak}</span>
          </div>
        )}
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="bg-[#838beb] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        ) : (
          <div className="relative group cursor-pointer">
            <div
              onClick={() => navigate("/dashboard")}
              className="bg-[#838beb] text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold text-lg uppercase"
            >
              {userid?.charAt(0)}
            </div>

            <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-200 z-50">
              <p className="px-4 py-1 text-sm text-gray-700">{userid}</p>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-1 text-sm text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Icon */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-gray-700"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col gap-4 p-6 md:hidden z-40">
          <a
            href="/journal"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700"
          >
            Journal
          </a>
          <a
            href="/productivity"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700"
          >
            Productivity
          </a>
          <a
            href="/analysis"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700"
          >
            Analysis
          </a>
          <a
            href="/pomodo"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700"
          >
            Pomodoro
          </a>
          <a
            href="/activity"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700"
          >
            Activity
          </a>
          <a
            href="/review"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700"
          >
            Review
          </a>

          {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="bg-[#838beb] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
          ) : (
            <div>
              <p className="text-gray-700 font-semibold mb-2">Hi, {userid}</p>
              <p className="text-sm text-gray-500 mb-2">🔥 Streak: {streak}</p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 bg-gray-100 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default MainNavbar;
