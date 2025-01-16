"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export function Navbar() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	return (
		<nav className="flex items-center justify-between bg-[#00203F] p-4 text-[#ADF0D1] shadow-md">
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
			<div className="hidden space-x-6 md:flex">
				<Link href="#about" className="transition-colors hover:text-white">
					About
				</Link>
				<Link href="#try" className="transition-colors hover:text-white">
					Let's try
				</Link>
				<Link href="#Footer" className="transition-colors hover:text-white">
					Contact
				</Link>
				<Link href="/login" className="transition-colors hover:text-white">
					Login
				</Link>
			</div>

			{/* Drawer Menu for Mobile */}
			{isDrawerOpen && (
				<div className="fixed inset-0 z-10 flex flex-col items-center justify-center space-y-6 bg-[#00203F] bg-opacity-90 text-lg">
					<Link
						href="#about"
						onClick={toggleDrawer}
						className="transition-colors hover:text-white"
					>
						About
					</Link>
					<Link
						href="#try"
						onClick={toggleDrawer}
						className="transition-colors hover:text-white"
					>
						Let's try
					</Link>
					<Link
						href="#Footer"
						onClick={toggleDrawer}
						className="transition-colors hover:text-white"
					>
						Contact
					</Link>
					<Link
						href="/login"
						onClick={toggleDrawer}
						className="transition-colors hover:text-white"
					>
						Login
					</Link>
				</div>
			)}
		</nav>
	);
}
