"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaDatabase, FaEdit, FaUserCircle, FaBook } from "react-icons/fa";
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
	const [scrollY, setScrollY] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	const handleLogout = async () => {
		await logoutAction();
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > scrollY) {
				setIsVisible(false); // Scroll down: hide navbar
			} else {
				setIsVisible(true); // Scroll up: show navbar
			}
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [scrollY]);

	return (
		<>
			{/* Navbar with scroll behavior */}
			<nav
				className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-[#00203F] p-5 text-[#ADF0D1] shadow-md transition-transform duration-300 ${
					isVisible ? "transform translate-y-0" : "transform -translate-y-full"
				}`}
			>
				{/* Logo */}
				<div className="text-2xl font-bold">sqlmentor</div>

				{/* Navigation Icons (Only visible if Drawer is not open) */}
				{!isDrawerOpen && (
					<div>
						<div className="hidden sm:flex items-center space-x-4">
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
							{/* Learning Icon */}
							<Link
								href="http://localhost:3000/basic/dataType"
								className="transition-colors hover:text-white"
								title="Learning"
							>
								<FaBook size={24} />
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
						<div className="sm:hidden">
							<button onClick={toggleDrawer} className="text-[#ADF0D1]">
								{isDrawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
							</button>
						</div>
					</div>
				)}

				{/* Drawer with links (Visible only on mobile when the Drawer is open) */}
				{isDrawerOpen && (
					<div className ="bg=[#00203F]  fixed top-0 right-0 z-10 flex flex-col items-start justify-start space-y-6 text-lg h-full w-64 py-4 px-6">
						{/* Back Button in Drawer */}
						<button
							onClick={() => {
								toggleDrawer();
							}}
							className="  transition-colors hover:text-white mb-4"
							title="Go Back"
						>
							<FaArrowLeft size={40} />
						</button>

						{/* Home Icon with Text */}
						<Link
							href="/home"
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title="Home"
						>
							<FaHome size={40} />
							<span>Home</span>
						</Link>
						{/* Profile Icon with Text */}
						<Link
							href="/Profile"
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title="Profile"
						>
							<FaUserCircle size={40} />
							<span>Profile</span>
						</Link>
						{/* user compiler Icon with Text */}
						<Link
							href="/UserDbEditor"
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title="Compiler"
						>
							<FaEdit size={40} />
							<span>Compiler</span>
						</Link>
						{/* Database Icon with Text */}
						<Link
							href="/DataBaseExeplorer"
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title="Explore My Database"
						>
							<FaDatabase size={40} />
							<span>Explore Database</span>
						</Link>
						{/* Community Icon with Text */}
						<Link
							href="/Community"
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title="Community"
						>
							<RiCommunityFill size={40} />
							<span>Community</span>
						</Link>
						{/* Learning Icon with Text */}
						<Link
							href="http://localhost:3000/basic/dataType"
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title="Learning"
						>
							<FaBook size={40} />
							<span>Learning</span>
						</Link>
						{/* Logout Button with Text */}
						<button
							onClick={() => {
								handleLogout();
								toggleDrawer();
							}}
							className="flex items-center space-x-4 transition-colors hover:text-white"
							title="Logout"
						>
							<FaSignOutAlt size={40} />
							<span>Logout</span>
						</button>
					</div>
				)}
			</nav>

			{/* Add a margin to ensure the content doesn't get overlapped by the fixed navbar */}
			<div className="mt-[72px]">
				{/* The rest of your page content goes here */}
			</div>
		</>
	);
}