import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // for mobile menu

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
      className={`w-full fixed top-0 left-0 z-50 px-6 md:px-8 py-3 flex justify-between items-center text-gray-800 transition-all duration-300 ${
        scrolled ? "bg-white/30 backdrop-blur-md shadow-2xl" : "bg-transparent"
      }`}
    >
      <span
        className={`text-2xl font-bold tracking-wide transition-colors duration-300 ${
          scrolled ? "text-gray-700" : "text-white"
        }`}
      >
        NeuroFlow
      </span>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          <div className="space-y-1">
            <span className="block h-0.5 w-6 bg-white"></span>
            <span className="block h-0.5 w-6 bg-white"></span>
            <span className="block h-0.5 w-6 bg-white"></span>
          </div>
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="space-x-6 hidden md:flex items-center">

        {["Home", "About", "Review", "Features", "Contact"].map((item) => (
          <Link
            key={item}
            to={item}
            className="hover:text-[#838beb] hover:scale-110 transition duration-200 cursor-pointer"

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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden z-50">
          {["Home", "About", "Review", "Features", "Contact"].map((item) => (
            <Link
              key={item}
              to={item}
              className="text-gray-700 hover:text-[#838beb] transition"
              smooth={true}
              duration={500}
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              handleNavigate();
            }}
            className="bg-[#838beb] text-white font-medium py-1.5 px-6 rounded-xl shadow hover:bg-[#838bee] transition"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;