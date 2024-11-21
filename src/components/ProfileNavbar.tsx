"use client";
import React, { useState } from "react";
import { FaBars, FaTimes, FaArrowLeft, FaHome, FaSignOutAlt, FaArrowRight, FaClipboard, FaFireAlt } from "react-icons/fa";

export function ProfileNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-[#00203F] text-[#ADF0D1] shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">sqlmentor</div>

      {/* Navigation Icons */}
      <div className="flex space-x-4 items-center">


        <button
          onClick={() => {
            console.log("Home button clicked"); // زر للذهاب للصفحة الرئيسية
          }}
          className="hover:text-white transition-colors"
          title="Home"
        >
          <FaFireAlt  size={24} />
        </button>

        
        <button
          onClick={() => {
            console.log("Logout button clicked"); // زر لتسجيل الخروج
          }}
          className="hover:text-white transition-colors"
          title="Logout"
        >
          <FaSignOutAlt size={24} />
        </button>
       

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
          {/* Back Button in Drawer */}
          <button
            onClick={() => {
              console.log("Go back button clicked"); // زر للعودة
              toggleDrawer();
            }}
            className="hover:text-white transition-colors"
            title="Go Back"
          >
            <FaArrowLeft size={40} />
          </button>

          {/* Home Button in Drawer */}
          <button
            onClick={() => {
              console.log("Home button clicked"); // زر للذهاب للصفحة الرئيسية
              toggleDrawer();
            }}
            className="hover:text-white transition-colors"
            title="Home"
          >
            <FaHome size={40} />
          </button>

          {/* Logout Button in Drawer */}
          <button
            onClick={() => {
              console.log("Logout button clicked"); // زر لتسجيل الخروج
              toggleDrawer();
            }}
            className="hover:text-white transition-colors"
            title="Logout"
          >
            <FaSignOutAlt size={40} />
          </button>
        </div>
      )}
    </nav>
  );
}
