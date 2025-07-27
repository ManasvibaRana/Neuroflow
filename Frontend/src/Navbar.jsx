import React, { useEffect, useState, useRef } from "react";
// Assuming react-router-dom and react-icons are installed
// import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

// A mock useNavigate hook for standalone demonstration purposes.
// In a real app, you would use the one from 'react-router-dom'.
const useNavigate = () => {
  return (path) => console.log(`Navigating to ${path}`);
};


// A new, self-contained component for rendering badges.
// It uses SVG for the icon and TailwindCSS for styling.
const Badge = ({ type }) => {
  // A map of configurations for each badge type, including styles and a unique icon.
  const badgeConfig = {
    bronze: {
      style: 'bg-orange-400 text-orange-800 border-orange-500',
      icon: <path fillRule="evenodd" d="M12 2L15.5 8.5L22 9.5L17 14.5L18.5 21L12 17.5L5.5 21L7 14.5L2 9.5L8.5 8.5L12 2Z" clipRule="evenodd" />
    },
    silver: {
      style: 'bg-gray-300 text-gray-700 border-gray-400',
      icon: <path fillRule="evenodd" d="M12 1C12.7 1 13.3 1.4 13.6 2L16.1 7.6L22.4 8.5C23.1 8.6 23.6 9.1 23.7 9.8C23.8 10.5 23.4 11.1 22.8 11.4L18.2 15.4L19.6 21.6C19.8 22.3 19.5 23 18.9 23.3C18.3 23.6 17.6 23.5 17.1 23L12 20.2L6.9 23C6.4 23.3 5.7 23.4 5.1 23.1C4.5 22.8 4.2 22.1L5.8 15.2L1.2 11.2C0.6 10.7 0.4 9.9 0.7 9.2C1 8.5 1.7 8.1 2.4 8.2L8.7 9.1L11.2 3.5C11.5 2.8 12.2 2.4 12.9 2.4C12.6 2.3 12.3 2.1 12 2V1Z" clipRule="evenodd" />
    },
    gold: {
      style: 'bg-yellow-400 text-yellow-800 border-yellow-500',
      icon: <path fillRule="evenodd" d="M12 1L15.09 7.26L22 8.27L17 13.14L18.18 20.02L12 16.77L5.82 20.02L7 13.14L2 8.27L8.91 7.26L12 1ZM12 3.5L9.5 8.5L4 9.2L7.5 12.5L6.5 18L12 15.2L17.5 18L16.5 12.5L20 9.2L14.5 8.5L12 3.5Z" clipRule="evenodd" />
    },
    platinum: {
      style: 'bg-slate-300 text-slate-700 border-slate-500',
      icon: <path fillRule="evenodd" d="M12 2C12.6 2 13.1 2.3 13.4 2.8L16.2 7.8L22 8.6C22.6 8.7 23.1 9.1 23.2 9.7C23.3 10.3 23 10.8 22.5 11.1L18.3 14.6L19.4 20.3C19.5 20.9 19.3 21.5 18.8 21.8C18.3 22.1 17.7 22 17.2 21.7L12 18.9L6.8 21.7C6.3 22 5.7 22.1 5.2 21.8C4.7 21.5 19.3 20.9 4.6 20.3L5.7 14.6L1.5 11.1C1 10.8 0.7 10.3 0.8 9.7C0.9 9.1 1.4 8.7 2 8.6L7.8 7.8L10.6 2.8C10.9 2.3 11.4 2 12 2ZM12 4.5L9.8 8.5L5.2 9.1L8.1 11.8L7.3 16.4L12 14.1L16.7 16.4L15.9 11.8L18.8 9.1L14.2 8.5L12 4.5ZM12 6C13.4 6 14.5 7.1 14.5 8.5S13.4 11 12 11S9.5 9.9 9.5 8.5S10.6 6 12 6Z" clipRule="evenodd" />
    },
    diamond: {
      style: 'bg-sky-300 text-sky-700 border-sky-500',
      icon: <path fillRule="evenodd" d="M12 2L18 8L12 22L6 8L12 2ZM12 4.8L8.4 8.8L12 18.2L15.6 8.8L12 4.8ZM12 6L14.5 8.5H9.5L12 6Z" clipRule="evenodd" />
    },
  };

  const config = badgeConfig[type];

  if (!config) {
    return null;
  }

  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${config.style}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        {config.icon}
      </svg>
    </div>
  );
};


function MainNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to logged in for demo
  const [userid, setUserid] = useState("SampleUser"); // Default user for demo
  const [streak, setStreak] = useState(15); // Default streak for demo
  const [badge, setBadge] = useState("gold"); // Default badge for demo
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Mock fetching user data
  useEffect(() => {
    // In a real app, you would fetch this data.
    // For this demo, we'll use the default state values.
    const storedUser = sessionStorage.getItem("userid");
    if (storedUser) {
      setIsLoggedIn(true);
      setUserid(storedUser);
      fetchStreakAndBadge(storedUser);
    } else {
      // For demo purposes, we'll keep the default logged-in state.
      // In a real app, you might set isLoggedIn to false here.
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const fetchStreakAndBadge = async (userid) => {
    // This is a mock API call.
    console.log(`Fetching data for ${userid}...`);
    try {
      // MOCK API RESPONSE
      const data = { streak: 28, badge: 'platinum' };
      setStreak(data.streak);
      setBadge(data.badge);
    } catch (err) {
      console.error("An error occurred in fetchStreakAndBadge:", err);
      setStreak(0);
      setBadge("none");
    }
  };

  const handleLogin = () => {
    sessionStorage.setItem("userid", "DemoUser");
    setIsLoggedIn(true);
    setUserid("DemoUser");
    setStreak(10);
    setBadge('silver');
    setMenuOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserid("");
    setMenuOpen(false);
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

        {/* App Name / Logo */}
        <div
          onClick={() => {
            navigate("/journal");
            setMenuOpen(false);
          }}
          className="text-2xl font-bold text-gray-800 cursor-pointer"
        >
          NeuroFlow
        </div>

        {/* Centered Nav Links (Desktop) */}
        <div className="hidden md:flex gap-6 lg:gap-8 text-gray-600 font-medium items-center">
          {navLinks.map(link => (
             <a key={link.name} href={link.path} className="hover:text-[#6a6ff2] transition-colors duration-200">
               {link.name}
             </a>
          ))}
        </div>

        {/* Right Section: Login/Profile & Hamburger */}
        <div className="flex items-center gap-4">
            {/* Desktop View */}
            <div className="hidden md:flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-purple-700">{streak}</span>
                                <span className="text-sm text-purple-600 font-medium">days</span>
                            </div>
                            <Badge type={badge} />
                        </div>
                        <div className="relative group cursor-pointer">
                            <div onClick={() => navigate("/dashboard")} className="bg-[#838beb] text-white w-10 h-10 flex items-center justify-center rounded-full font-semibold text-lg uppercase">
                                {userid?.charAt(0)}
                            </div>
                            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-200 z-50">
                                <p className="px-4 py-1 text-sm text-gray-700 font-semibold truncate">{userid}</p>
                                <hr className="my-1" />
                                <button onClick={handleLogout} className="w-full text-left px-4 py-1 text-sm text-red-500 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <button onClick={handleLogin} className="bg-[#838beb] text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-semibold">
                        Login
                    </button>
                )}
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex items-center gap-3">
                {isLoggedIn ? (
                    <>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-1.5 rounded-full border border-purple-200">
                            <span className="text-base font-bold text-purple-700">{streak}</span>
                            <Badge type={badge} />
                        </div>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700" aria-label="Open menu">
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </>
                ) : (
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700" aria-label="Open menu">
                         {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg flex flex-col gap-2 p-6 z-40 animate-slide-down">
          {navLinks.map(link => (
             <a
                key={link.name}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-[#6a6ff2] p-2 rounded-md text-lg"
             >
               {link.name}
             </a>
          ))}
          
          <hr className="my-4"/>

          {isLoggedIn ? (
            <div>
              <p className="text-gray-700 font-semibold mb-4 p-2 text-lg">Hi, {userid}</p>
              <button
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 text-md font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
             <button
                onClick={handleLogin}
                className="w-full bg-[#838beb] text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-semibold text-lg"
              >
                Login
              </button>
          )}
        </div>
      )}
    </nav>
  );
}

// Add a simple animation for the mobile menu dropdown
const style = document.createElement('style');
style.innerHTML = `
  @keyframes slide-down {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slide-down {
    animation: slide-down 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);


export default MainNavbar;
