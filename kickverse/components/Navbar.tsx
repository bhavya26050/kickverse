import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">KickVerse</div>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="text-gray-300 hover:text-white">Home</a>
          </li>
          <li>
            <a href="/shop" className="text-gray-300 hover:text-white">Shop</a>
          </li>
          <li>
            <a href="/about" className="text-gray-300 hover:text-white">About</a>
          </li>
          <li>
            <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;