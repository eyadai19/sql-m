"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaUserCircle, FaDatabase } from "react-icons/fa";

export function EditorNavbar() {
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

      {/* Navigation Icons */}
      <div className="flex space-x-4 items-center">
        {/* Database Icon */}
        <Link href="/DataBaseExeplorer" className="hover:text-white transition-colors" title="Explore My Database">
          <FaDatabase size={24} />
        </Link>
        {/* Profile Icon */}
        <Link href="/profile" className="hover:text-white transition-colors" title="Profile">
          <FaUserCircle size={24} />
        </Link>

        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <button onClick={toggleDrawer} className="text-[#ADF0D1]">
            {isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Drawer Menu for Mobile */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-[#00203F] bg-opacity-90 flex flex-col items-center justify-center space-y-6 text-lg z-10">
          <Link href="/profile" onClick={toggleDrawer} className="hover:text-white transition-colors" title="Profile">
            <FaUserCircle size={40} />
          </Link>
          <Link href="/DataBaseExeplorer" onClick={toggleDrawer} className="hover:text-white transition-colors" title="Explore My Database">
            <FaDatabase size={40} />
          </Link>
        </div>
      )}
    </nav>
  );
}
