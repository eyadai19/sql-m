"use client";
import { useState } from "react";
import {
	FaArrowLeft,
	FaBars,
	FaFireAlt,
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
			<div className="flex items-center space-x-4">
				<button
					onClick={() => {
						console.log("Home button clicked"); // زر للذهاب للصفحة الرئيسية
					}}
					className="transition-colors hover:text-white"
					title="Home"
				>
					<FaFireAlt size={24} />
				</button>

				<button
					onClick={() => {
						handleLogout();
					}}
					className="transition-colors hover:text-white"
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

					{/* Home Button in Drawer */}
					<button
						onClick={() => {
							console.log("Home button clicked"); // زر للذهاب للصفحة الرئيسية
							toggleDrawer();
						}}
						className="transition-colors hover:text-white"
						title="Home"
					>
						<FaHome size={40} />
					</button>

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
