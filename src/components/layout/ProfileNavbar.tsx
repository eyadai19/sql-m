"use client";
import Link from "next/link";
import { useState } from "react";
import { FaDatabase, FaEdit, FaUserCircle } from "react-icons/fa";
import { RiCommunityFill } from "react-icons/ri";

import {
	FaArrowLeft,
	FaBars,
	FaHome,
	FaSignOutAlt,
	FaTimes,
} from "react-icons/fa";

export function ProfileNavbar({
	logoutAction,
}: {
	logoutAction: () => Promise<void>;
}) {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	const handleLogout = async () => {
		await logoutAction();
	};
	return (
		<nav className="flex items-center justify-between bg-[#00203F] p-4 text-[#ADF0D1] shadow-md">
			{/* Logo */}
			<div className="text-2xl font-bold">sqlmentor</div>

			{/* Navigation Icons */}
			{!isDrawerOpen && (
				<div>
					<div className="hidden items-center space-x-4 sm:flex">
						{/* Home Icon */}
						<Link
							href="/home"
							className="transition-colors hover:text-white"
							title="Home"
						>
							<FaHome size={27} />
						</Link>
						{/* Profile Icon */}
						<Link
							href="/Profile"
							className="transition-colors hover:text-white"
							title="Profile"
						>
							<FaUserCircle size={24} />
						</Link>
						{/* user compiler Icon */}
						<Link
							href="/UserDbEditor"
							className="transition-colors hover:text-white"
							title="Compiler"
						>
							<FaEdit size={24} />
						</Link>
						{/* Database Icon */}
						<Link
							href="/DataBaseExeplorer"
							className="transition-colors hover:text-white"
							title="Explore My Database"
						>
							<FaDatabase size={24} />
						</Link>
						{/* Community Icon */}
						<Link
							href="/Community"
							className="transition-colors hover:text-white"
							title="Community"
						>
							<RiCommunityFill size={24} />
						</Link>
						<button
							onClick={() => {
								handleLogout();
							}}
							className="transition-colors hover:text-white"
							title="Logout"
						>
							<FaSignOutAlt size={24} />
						</button>
					</div>
					{/* Hamburger icon for mobile */}
					<div className="md:hidden">
						<button onClick={toggleDrawer} className="text-[#ADF0D1]">
							{isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
						</button>
					</div>
				</div>
			)}

			{isDrawerOpen && (
				<div className="fixed inset-0 z-10 flex flex-col items-center justify-center space-y-6 bg-[#00203F] bg-opacity-90 text-lg">
					{/* Back Button in Drawer */}
					<button
						onClick={() => {
							console.log("Go back button clicked"); // زر للعودة
							toggleDrawer();
						}}
						className="transition-colors hover:text-white"
						title="Go Back"
					>
						<FaArrowLeft size={40} />
					</button>

					{/* Home Icon */}
					<Link
						href="/home"
						className="transition-colors hover:text-white"
						title="Home"
					>
						<FaHome size={40} />
					</Link>
					{/* Profile Icon */}
					<Link
						href="/Profile"
						className="transition-colors hover:text-white"
						title="Profile"
					>
						<FaUserCircle size={40} />
					</Link>
					{/* user compiler Icon */}
					<Link
						href="/UserDbEditor"
						className="transition-colors hover:text-white"
						title="Compiler"
					>
						<FaEdit size={40} />
					</Link>
					{/* Database Icon */}
					<Link
						href="/DataBaseExeplorer"
						className="transition-colors hover:text-white"
						title="Explore My Database"
					>
						<FaDatabase size={40} />
					</Link>
					{/* Community Icon */}
					<Link
						href="/Community"
						className="transition-colors hover:text-white"
						title="Community"
					>
						<RiCommunityFill size={40} />
					</Link>
					{/* Logout Button in Drawer */}
					<button
						onClick={() => {
							toggleDrawer();
						}}
						className="transition-colors hover:text-white"
						title="Logout"
					>
						<FaSignOutAlt size={40} />
					</button>
				</div>
			)}
		</nav>
	);
}
