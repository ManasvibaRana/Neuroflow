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
      className={`w-full fixed top-0 left-0 z-50 px-8 py-6 flex justify-between items-center text-gray-800 transition-all duration-300 ${
        scrolled ? "bg-white/30 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-bold tracking-wide text-white drop-shadow-sm">
          NeuroFlow
        </span>
      </div>

      <div className="space-x-6 hidden md:flex">
        <Link
          to="Home"
          className="hover:text-[#838beb] transition cursor-pointer p-2"
          smooth={true}
          duration={500}
        >
          Home
        </Link>
        <Link
          to="About"
          className="hover:text-[#838beb] transition cursor-pointer p-2"
          smooth={true}
          duration={500}
        >
          About
        </Link>
        <Link
          to="Review"
          className="hover:text-[#838beb] transition cursor-pointer p-2"
          smooth={true}
          duration={500}
        >
          Review
        </Link>
        <Link
          to="Features"
          className="hover:text-[#838beb] transition cursor-pointer p-2"
          smooth={true}
          duration={500}
        >
          Features
        </Link>
        <Link
          to="Contact"
          className="hover:text-[#838beb] transition cursor-pointer p-2"
          smooth={true}
          duration={500}
        >
          Contact
        </Link>

        <button
          onClick={handleNavigate}
          className="bg-[#838beb] text-white font-medium py-1.5 px-4 rounded-xl shadow-md hover:bg-indigo-100 transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
