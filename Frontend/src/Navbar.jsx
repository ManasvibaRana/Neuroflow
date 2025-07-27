import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

// ✅ Badge Component
const Badge = ({ type }) => {
  const badgeConfig = {
    bronze: {
      style: "bg-orange-400 text-orange-800 border-orange-500",
      icon: <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18.5 21L12 17.5L5.5 21L7 14.5L2 9.5L8.5 8.5L12 2Z" />,
    },
    silver: {
      style: "bg-gray-100 text-gray-700 border-gray-400",
      icon: <path d="M12 1L16.1 7.6L22.4 8.5L18.2 15.4L19.6 21.6L12 20.2L6.9 23L8.1 15.2L1.2 11.2L8.7 9.1L11.2 3.5Z" />,
    },
    gold: {
      style: "bg-yellow-400 text-yellow-800 border-yellow-500",
      icon: <path d="M12 1L15.09 7.26L22 8.27L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.27L8.91 7.26L12 1Z" />,
    },
    platinum: {
      style: "bg-slate-300 text-slate-700 border-slate-500",
      icon: <path d="M12 2L16.2 7.8L22 8.6L18.3 14.6L19.4 20.3L12 18.9L6.8 21.7L5.7 14.6L1.5 11.1L7.8 7.8L10.6 2.8Z" />,
    },
    diamond: {
      style: "bg-sky-300 text-sky-700 border-sky-500",
      icon: <path d="M12 2L18 8L12 22L6 8L12 2ZM12 4.8L8.4 8.8L12 18.2L15.6 8.8L12 4.8Z" />,
    },
  };

  const config = badgeConfig[type];
  if (!config) return null;

  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${config.style}`}>
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        {config.icon}
      </svg>
    </div>
  );
};

function MainNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [badge, setBadge] = useState("bronze");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userid, setUserid] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userid");
    if (storedUser) {
      setIsLoggedIn(true);
      setUserid(storedUser);
      fetchStreakAndBadge(storedUser);
    }
  }, []);

  useEffect(() => {
    const closeMenu = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const fetchStreakAndBadge = async (userid) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/get-user-stats/?userid=${userid}`);
      if (!res.ok) throw new Error("Failed to fetch user stats");
      const data = await res.json();
      setStreak(data.streak);
      setBadge(data.badge);
    } catch (err) {
      console.error("Stats fetch error:", err);
      setStreak(0);
      setBadge("bronze");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserid(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Journal", path: "/journal" },
    { name: "Productivity", path: "/productivity" },
    { name: "Analysis", path: "/analysis" },
    { name: "Pomodoro", path: "/pomodo" },
    { name: "Activity", path: "/activity" },
    { name: "Review", path: "/review" },
  ];

  return (
    <nav ref={navRef} className="bg-white shadow-md px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div onClick={() => navigate("/journal")} className="text-2xl font-bold text-gray-800 cursor-pointer">
          NeuroFlow
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          {navLinks.map((link) => (
            <a key={link.name} href={link.path} className="hover:text-[#6a6ff2] transition">
              {link.name}
            </a>
          ))}
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full border">
                <span className="text-lg font-bold text-purple-700">{streak}</span>
                <span className="text-sm text-purple-600">days</span>
                <Badge type={badge} />
              </div>
              <div className="relative group">
                <div onClick={() => navigate("/dashboard")} className="bg-[#838beb] text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer">
                  {userid?.[0]?.toUpperCase()}
                </div>
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md py-2 opacity-0 group-hover:opacity-100 transition z-50">
                  <p className="px-4 py-1 text-gray-700">{userid}</p>
                  <hr />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-1 text-red-500 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="bg-[#838beb] text-white px-5 py-2 rounded-lg hover:bg-indigo-700">
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-2xl text-gray-700">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col gap-2 p-6 animate-slide-down">
          {navLinks.map((link) => (
            <a key={link.name} href={link.path} onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-[#6a6ff2]">
              {link.name}
            </a>
          ))}
          <hr />
          {isLoggedIn ? (
            <>
              <p className="text-gray-700">Hi, {userid}</p>
              <button onClick={handleLogout} className="w-full px-4 py-2 text-red-500 bg-red-50 rounded-lg">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/login")} className="w-full bg-[#838beb] text-white px-4 py-2 rounded-lg">
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default MainNavbar;
