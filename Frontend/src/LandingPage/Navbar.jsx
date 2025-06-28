import { useNavigate } from "react-router-dom";
import { Link } from 'react-scroll';

function Navbar() {

  const navigate = useNavigate()
 
  function handleNavigate(){
      navigate("/login")
  }


  return (
    <nav className="bg-[linear-gradient(45deg,#796fc1_0%,#838beb_100%)] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* <img
            src={brain}
            alt="NeuroFlow Logo"
            className="h-15 w-15 object-contain rounded-full"
          /> */}
          <span className="text-2xl font-bold tracking-wide">NeuroFlow</span>
        </div>

        <div className="space-x-6 hidden md:flex">
         
        <Link to="Home" className="hover:text-indigo-200 transition cursor-pointer"  smooth={true} duration={500}>Home</Link>
        <Link to="About" className="hover:text-indigo-200 transition cursor-pointer"  smooth={true} duration={500}>About</Link> 
        <Link to="Review" className="hover:text-indigo-200 transition cursor-pointer"  smooth={true} duration={500}>Review</Link>
        <Link to="Features" className="hover:text-indigo-200 transition cursor-pointer"  smooth={true} duration={500}>Features</Link>
        <Link to="Contact" className="hover:text-indigo-200 transition cursor-pointer"  smooth={true} duration={500}>Contact</Link>
         
            
        
        </div>

        <button
          onClick={handleNavigate}
          className="bg-white text-indigo-800 font-medium py-1.5 px-4 rounded-lg shadow-md hover:bg-indigo-100 transition"
        >
          Sign In
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
