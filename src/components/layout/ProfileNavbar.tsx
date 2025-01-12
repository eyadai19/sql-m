"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
	FaArrowLeft,
	FaBars,
	FaBook,
	FaDatabase,
	FaEdit,
	FaHome,
	FaSignOutAlt,
	FaTimes,
	FaUserCircle,
} from "react-icons/fa";
import { RiCommunityFill } from "react-icons/ri";

export function ProfileNavbar({
	logoutAction,
}: {
	logoutAction: () => Promise<void>;
}) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [isNavbarVisible, setIsNavbarVisible] = useState(true);

	const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

	const handleLogout = async () => {
		await logoutAction();
		setIsDrawerOpen(false); // Close the drawer after logout
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsNavbarVisible(window.scrollY <= lastScrollY);
			setLastScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	useEffect(() => {
		const handleResize = () => {
			// Close drawer if the screen width is large (>= 640px)
			if (window.innerWidth >= 640 && isDrawerOpen) {
				setIsDrawerOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isDrawerOpen]);

	const navLinks = [
		{ href: "/home", icon: FaHome, label: "Home" },
		{ href: "/Profile", icon: FaUserCircle, label: "Profile" },
		{ href: "/UserDbEditor", icon: FaEdit, label: "Compiler" },
		{ href: "/DataBaseExeplorer", icon: FaDatabase, label: "Explore Database" },
		{ href: "/Community", icon: RiCommunityFill, label: "Community" },
		{
			href: "http://localhost:3000/basic/dataType",
			icon: FaBook,
			label: "Learning",
		},
	];

	return (
		<>
			{/* Navbar */}
			<nav
				className={`fixed left-0 right-0 top-0 flex items-center justify-between bg-[#00203F] p-5 text-[#ADF0D1] shadow-md transition-transform duration-300 ${
					isNavbarVisible ? "translate-y-0" : "-translate-y-full"
				} ${isDrawerOpen ? "z-40" : "z-50"}`}
			>
				{/* Logo */}
				<div className="text-2xl font-bold">sqlmentor</div>

				{/* Desktop Navigation */}
				<div className="hidden items-center space-x-4 sm:flex">
					{navLinks.map(({ href, icon: Icon, label }) => (
						<Link
							key={label}
							href={href}
							className="transition-colors hover:text-white"
							title={label}
						>
							<Icon size={24} />
						</Link>
					))}
					<button
						onClick={handleLogout}
						className="transition-colors hover:text-white"
						title="Logout"
					>
						<FaSignOutAlt size={24} />
					</button>
				</div>

				{/* Mobile Hamburger Menu */}
				<div className="sm:hidden">
					<button onClick={toggleDrawer} className="text-[#ADF0D1]">
						{isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
					</button>
				</div>
			</nav>

			{/* Drawer */}
			{isDrawerOpen && (
				<div className="fixed right-0 top-0 z-50 flex h-full w-64 flex-col space-y-6 bg-[#00203F] p-6 text-[#ADF0D1] shadow-lg">
					{/* Close Drawer Button */}
					<button
						onClick={toggleDrawer}
						className="mb-4 text-left transition-colors hover:text-white"
						title="Close Drawer"
					>
						<FaArrowLeft size={24} />
					</button>

					{navLinks.map(({ href, icon: Icon, label }) => (
						<Link
							key={label}
							href={href}
							className="flex items-center space-x-4 transition-colors hover:text-white"
							onClick={toggleDrawer}
							title={label}
						>
							<Icon size={24} />
							<span>{label}</span>
						</Link>
					))}

					<button
						onClick={handleLogout}
						className="flex items-center space-x-4 transition-colors hover:text-white"
						title="Logout"
					>
						<FaSignOutAlt size={24} />
						<span>Logout</span>
					</button>
				</div>
			)}

			{/* Page Content Padding */}
			<div className="mt-[72px]">{/* Your page content here */}</div>
		</>
	);
}
