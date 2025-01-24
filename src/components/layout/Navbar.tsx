"use client";

import Image from "next/image";
import { useRouter } from "next/navigation"; // استيراد useRouter
import { useState } from "react";
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

export function Navbar({
	logoutAction,
}: {
	logoutAction: () => Promise<void>;
}) {
	const router = useRouter();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

	const handleLogout = async () => {
		await logoutAction();
		setIsDrawerOpen(false);
	};

	const handleNavigation = (href: string) => {
		router.push(href);
		setIsDrawerOpen(false);
	};

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
			<nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#00203F] p-3 text-[#ADF0D1] shadow-md">
				{/* Logo */}
				<div className="flex items-center space-x-3">
					<Image
						src="/LogoSizeTrue.png"
						alt="Logo"
						width={45}
						height={45}
						className="cursor-pointer"
						onClick={() => handleNavigation("/home")}
					/>
					<div className="text-2xl font-bold">sqlmentor</div>
				</div>
				{/* Desktop Navigation */}
				<div className="hidden items-center space-x-4 sm:flex">
					{navLinks.map(({ href, icon: Icon, label }) => (
						<button
							key={label}
							onClick={() => handleNavigation(href)} // استخدام handleNavigation
							className="transition-colors hover:text-white"
							title={label}
						>
							<Icon size={24} />
						</button>
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
						<button
							key={label}
							onClick={() => handleNavigation(href)} // استخدام handleNavigation
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title={label}
						>
							<Icon size={24} />
							<span>{label}</span>
						</button>
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
			<div className="mt-[60px]">{/* Your page content here */}</div>
		</>
	);
}
