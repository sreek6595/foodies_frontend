import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deepDropdownOpen, setDeepDropdownOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
        setDeepDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
const navigate =useNavigate()
  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center text-2xl font-bold text-gray-900">
          <img src="/image.jpeg" alt="Foodies Corner" className="h-16 mr-2" />
          <span className="text-red-500">Foodies Corner</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 absolute md:relative bg-white w-full md:w-auto top-16 left-0 md:top-0 md:bg-transparent shadow-md md:shadow-none`}
        >
          <ul className="md:flex md:space-x-6 p-4 md:p-0">
            <li><a href="#hero" className="nav-link">Home</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#menu" className="nav-link">Menu</a></li>
            {/* <li onClick={() => navigate('/menu')} className="nav-link cursor-pointer">
      Menu
    </li> */}
            {/* <li><a href="#events" className="nav-link">Events</a></li>
            <li><a href="#chefs" className="nav-link">Chefs</a></li>
            <li><a href="#gallery" className="nav-link">Gallery</a></li> */}

            {/* Dropdown */}
            {/* <li className="relative dropdown-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="nav-link flex items-center hover:text-red-500 transition duration-300"
              >
                More 
                <ChevronDown
                  size={18}
                  className={`ml-1 transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu absolute left-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-48 border border-gray-200">
                  <li>
                    <a href="#" className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Dropdown 1
                    </a>
                  </li>
                  <li className="relative dropdown-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeepDropdownOpen(!deepDropdownOpen);
                      }}
                      className="dropdown-item flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Deep Dropdown 
                      <ChevronDown
                        size={14}
                        className={`ml-1 transition-transform duration-300 ${
                          deepDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {deepDropdownOpen && (
                      <ul className="dropdown-menu absolute left-full top-0 bg-white shadow-lg rounded-lg p-2 w-48 border border-gray-200">
                        <li>
                          <a href="#" className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            Deep 1
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            Deep 2
                          </a>
                        </li>
                        <li>
                          <a href="#" className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                            Deep 3
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li>
                    <a href="#" className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Dropdown 2
                    </a>
                  </li>
                  <li>
                    <a href="#" className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Dropdown 3
                    </a>
                  </li>
                </ul>
              )}
            </li> */}

            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Sign In Buttons */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link
            to="/Login"
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Sign In
          </Link>
          <Link
            to="/dboyregis"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition font-semibold"
          >
            Delivery Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;