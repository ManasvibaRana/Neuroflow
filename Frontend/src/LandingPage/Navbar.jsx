import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  function handleNavigate() {
    navigate("/login");
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 px-8 py-3 flex justify-between items-center text-gray-800 transition-allv  duration-300 ${
        scrolled ? "bg-white/30 backdrop-blur-md shadow-2xl" : "bg-transparent"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span
          className={`text-2xl font-bold tracking-wide transition-colors duration-300 ${
            scrolled ? "text-gray-700" : "text-white"
          }`}
        >
          NeuroFlow
        </span>
      </div>

      <div className="space-x-6 hidden md:flex">
        {["Home", "About", "Review", "Features", "Contact"].map((item) => (
          <Link
            key={item}
            to={item}
            className="hover:text-[#838beb] hover:scale-110 transition duration-200 cursor-pointer p-2"
            smooth={true}
            duration={500}
          >
            {item}
          </Link>
        ))}

        <button
          onClick={handleNavigate}
          className="bg-[#838beb] text-white font-medium py-1.5 px-4 rounded-xl shadow-md hover:bg-[#838bee] hover:scale-110 transition duration-500"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;