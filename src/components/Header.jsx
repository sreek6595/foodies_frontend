import { useState } from "react";
// import { BiChevronDown, BiList } from "react-icons/bi";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deepDropdownOpen, setDeepDropdownOpen] = useState(false);


  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="/" className="flex items-center text-2xl font-bold text-gray-800">
          Yummy<span className="text-red-500">.</span>
        </a>

        <nav className="hidden md:flex space-x-6">
          <a href="#hero" className="text-gray-700 hover:text-red-500">Home</a>
          <a href="#about" className="text-gray-700 hover:text-red-500">About</a>
          <a href="#menu" className="text-gray-700 hover:text-red-500">Menu</a>
          <a href="#events" className="text-gray-700 hover:text-red-500">Events</a>
          <a href="#chefs" className="text-gray-700 hover:text-red-500">Chefs</a>
          <a href="#gallery" className="text-gray-700 hover:text-red-500">Gallery</a>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-gray-700 hover:text-red-500"
            >
              Dropdown <BiChevronDown className="ml-1" />
            </button>
            {dropdownOpen && (
              <ul className="absolute bg-white shadow-lg mt-2 rounded-md w-40">
                <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Dropdown 1</a></li>
                <li className="relative">
                  <button
                    onClick={() => setDeepDropdownOpen(!deepDropdownOpen)}
                    className="flex justify-between w-full px-4 py-2 hover:bg-gray-100"
                  >
                    Deep Dropdown <BiChevronDown />
                  </button>
                  {deepDropdownOpen && (
                    <ul className="absolute left-full top-0 bg-white shadow-lg mt-0 rounded-md w-40">
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Deep Dropdown 1</a></li>
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Deep Dropdown 2</a></li>
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Deep Dropdown 3</a></li>
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Deep Dropdown 4</a></li>
                      <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Deep Dropdown 5</a></li>
                    </ul>
                  )}
                </li>
                <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Dropdown 2</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Dropdown 3</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-gray-100">Dropdown 4</a></li>
              </ul>
            )}
          </div>

          <a href="#contact" className="text-gray-700 hover:text-red-500">Contact</a>
        </nav>

        <a href="#book-a-table" className="hidden md:block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Book a Table
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          <BiList size={30} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md py-4">
          <a href="#hero" className="block px-6 py-2">Home</a>
          <a href="#about" className="block px-6 py-2">About</a>
          <a href="#menu" className="block px-6 py-2">Menu</a>
          <a href="#events" className="block px-6 py-2">Events</a>
          <a href="#chefs" className="block px-6 py-2">Chefs</a>
          <a href="#gallery" className="block px-6 py-2">Gallery</a>
          <a href="#contact" className="block px-6 py-2">Contact</a>
          <a href="#book-a-table" className="block px-6 py-2 bg-red-500 text-white text-center rounded-lg mt-2 mx-6">Book a Table</a>
        </div>
      )}
    </header>
  );
};

export default Header;
