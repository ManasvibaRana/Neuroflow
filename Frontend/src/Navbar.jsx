import React, { useEffect, useState, useRef } from "react";
// 1. Import useLocation
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Sun, LogOut, User, BarChart2 } from "lucide-react";

// --- Badge Component (Slightly tweaked for better contrast) ---
const Badge = ({ type }) => {
  const badgeConfig = {
    bronze: {
      style: "bg-orange-100 text-orange-800 border-orange-400",
      icon: <path d="M12 2L15.5 8.5L22 9.5L17 14.5L18.5 21L12 17.5L5.5 21L7 14.5L2 9.5L8.5 8.5L12 2Z" />,
    },
    silver: {
      style: "bg-gray-200 text-gray-800 border-gray-400",
      icon: <path d="M12 1L16.1 7.6L22.4 8.5L18.2 15.4L19.6 21.6L12 20.2L6.9 23L8.1 15.2L1.2 11.2L8.7 9.1L11.2 3.5Z" />,
    },
    gold: {
      style: "bg-yellow-100 text-yellow-800 border-yellow-400",
      icon: <path d="M12 1L15.09 7.26L22 8.27L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.27L8.91 7.26L12 1Z" />,
    },
    platinum: {
      style: "bg-slate-200 text-slate-800 border-slate-500",
      icon: <path d="M12 2L16.2 7.8L22 8.6L18.3 14.6L19.4 20.3L12 18.9L6.8 21.7L5.7 14.6L1.5 11.1L7.8 7.8L10.6 2.8Z" />,
    },
    diamond: {
      style: "bg-sky-200 text-sky-800 border-sky-500",
      icon: <path d="M12 2L18 8L12 22L6 8L12 2ZM12 4.8L8.4 8.8L12 18.2L15.6 8.8L12 4.8Z" />,
    },
  };

  const config = badgeConfig[type];
  if (!config) return null;

  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${config.style}`}>
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        {config.icon}
      </svg>
    </div>
  );
};

function MainNavbar() {
  const navigate = useNavigate();
  // 2. Initialize the hook
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [badge, setBadge] = useState("bronze");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userid, setUserid] = useState(null);

  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userid");
    if (storedUser) {
      setIsLoggedIn(true);
      setUserid(storedUser);
      fetchStreakAndBadge(storedUser);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    { name: "21 Days", path: "/21days" },
    { name: "Community", path: "/community" },
  ];

  return (
    <>
      <nav ref={navRef} className="bg-white/80 backdrop-blur-md shadow-sm px-4 sm:px-6 py-3 sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Logo */}
          <div onClick={() => navigate("/journal")} className="text-2xl font-bold text-gray-800 cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            NeuroFlow
          </div>

          {/* Desktop Links - Hidden on smaller screens */}
          <div className="hidden lg:flex items-center gap-6 font-medium">
            {navLinks.map((link) => {
              // 3. Check if the link is active
              const isActive = location.pathname === link.path;
              return (
                <a
                  key={link.name}
                  href={link.path}
                  // 4. Apply classes conditionally
                  className={`relative transition-colors duration-300 hover:text-indigo-600 ${
                    isActive
                      ? 'text-indigo-600 font-semibold '
                      : 'text-gray-700'
                  } after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:bg-indigo-500 after:transition-all after:duration-300 hover:`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Section: User Info & Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
                  <Badge type={badge} />
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-indigo-700">{streak}</span>
                    <span className="text-xs text-indigo-500 ml-1">days</span>
                  </div>
                </div>

                {/* User Avatar & Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-indigo-500 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer ring-2 ring-offset-2 ring-transparent group-hover:ring-indigo-400 transition-all duration-300">
                    {userid?.[0]?.toUpperCase()}
                  </button>

                  <div className={`absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 transition-all duration-300 ease-in-out ${dropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}>
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-semibold text-gray-800 truncate">{userid}</p>
                      </div>
                      <a href="/dashboard" className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><User className="w-4 h-4" /> Profile</a>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                  </div>
                </div>
              </>
            ) : (
              <button onClick={() => navigate("/login")} className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-sm">
                Login
              </button>
            )}
              {/* Mobile Menu Icon - Now appears on screens smaller than lg */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-2xl text-gray-700 z-50">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu Overlay --- */}
      <div className={`fixed inset-0 bg-black/40 z-40 transition-opacity lg:hidden ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)}></div>
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">NeuroFlow</h2>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                // 5. Apply same logic to mobile menu
                const isActive = location.pathname === link.path;
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`font-medium text-lg transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
            <hr className="my-6"/>
              {isLoggedIn ? (
                <div className="mt-auto">
                  <p className="text-gray-600 text-sm mb-3">Signed in as <span className="font-semibold">{userid}</span></p>
                  <button onClick={handleLogout} className="w-full text-center px-4 py-2 text-red-500 bg-red-50 rounded-lg font-semibold">
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => {navigate("/login"); setMenuOpen(false);}} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold mt-auto">
                  Login
                </button>
              )}
          </div>
      </div>
    </>
  );
}

export default MainNavbar;