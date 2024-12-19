"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa"; 

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-[#00203F] text-[#ADF0D1] shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link href="/home">sqlmentor</Link>
      </div>

      {/* Hamburger icon for mobile */}
      <div className="md:hidden">
        <button onClick={toggleDrawer} className="text-[#ADF0D1]">
          {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Navigation Links - Hidden on small screens, visible on medium and up */}
      <div className="hidden md:flex space-x-6">
        <Link href="#about" className="hover:text-white transition-colors">
          About
        </Link>
        <Link href="#try" className="hover:text-white transition-colors">
          Let's try
        </Link>
        <Link href="#Footer" className="hover:text-white transition-colors">
          Contact
        </Link>
        <Link href="/login" className="hover:text-white transition-colors">
          Login
        </Link>
      </div>

      {/* Drawer Menu for Mobile */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-[#00203F] bg-opacity-90 flex flex-col items-center justify-center space-y-6 text-lg z-10">
          <Link href="#about" onClick={toggleDrawer} className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="#try" onClick={toggleDrawer} className="hover:text-white transition-colors">
            Let's try
          </Link>
          <Link href="#Footer" onClick={toggleDrawer} className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/login" onClick={toggleDrawer} className="hover:text-white transition-colors">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
