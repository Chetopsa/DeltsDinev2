import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMenu, IoClose } from 'react-icons/io5';  // Icons for the hamburger menu and close icon

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu on click
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-purple-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-400">
          Delts Dine
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {isOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-4">
          <Link
            to="/"
            className="hover:text-purple-300 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="hover:text-purple-300 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/menu"
            className="hover:text-purple-300 transition duration-200"
          >
            Menu
          </Link>
        </div>
      </div>

      {/* Mobile Menu Links (visible when isOpen is true) */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} bg-purple-700`}>
        <div className="space-y-4 px-4 py-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-lg hover:text-purple-300 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block text-lg hover:text-purple-300 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/menu"
            onClick={() => setIsOpen(false)}
            className="block text-lg hover:text-purple-300 transition duration-200"
          >
            Menu
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
