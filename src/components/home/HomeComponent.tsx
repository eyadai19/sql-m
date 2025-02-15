"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	FaDatabase,
	FaLightbulb,
	FaMedal,
	FaQuestionCircle,
	FaRobot,
	FaTable,
	FaUsers,
} from "react-icons/fa";

export function HomeComponent() {
	const router = useRouter();
	const [showPopup, setShowPopup] = useState(true);
	const [animateContent, setAnimateContent] = useState(false);

	const handlePopupClose = () => {
		setShowPopup(false);
		setAnimateContent(true); // تشغيل الأنيميشن عند إغلاق النافذة المنبثقة
	};

	return (
		<div>
			{showPopup && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 32, 63, 0.9)", // خلفية داكنة مائلة إلى الأزرق
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}
				>
					<div
						style={{
							backgroundColor: "#FFFFFF", // خلفية بيضاء للحاوية
							color: "#00203F",
							padding: "30px",
							borderRadius: "15px",
							maxWidth: "90%",
							width: "450px",
							textAlign: "center",
							boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
							border: "2px solid #ADF0D1", // إطار مميز
						}}
					>
						<h2
							style={{
								fontSize: "1.8rem",
								marginBottom: "15px",
								color: "#00203F",
								fontWeight: "bold",
							}}
						>
							🚀 Discover Amazing Features!
						</h2>
						<p
							style={{
								fontSize: "1rem",
								marginBottom: "20px",
								color: "#555555",
							}}
						>
							Explore our cutting-edge features that empower your experience:
						</p>
						<ul
							style={{
								listStyleType: "none",
								padding: 0,
								marginBottom: "25px",
								lineHeight: "1.6",
								textAlign: "left", // محاذاة النص لليسار
							}}
						>
							{[
								{
									icon: FaRobot,
									text: "AI Chatbot for generating smart queries",
								},
								{ icon: FaLightbulb, text: "Automatic SQL syntax suggestions" },
								{
									icon: FaDatabase,
									text: "Advanced database editor tailored for you",
								},
								{
									icon: FaTable,
									text: "Interactive ER diagrams for database tables",
								},
								{
									icon: FaMedal,
									text: "Highlight your achievements with pride",
								},
								{
									icon: FaUsers,
									text: "Engage with a collaborative community",
								},
								{
									icon: FaQuestionCircle,
									text: "Participate in progress-based quizzes",
								},
							].map(({ icon: Icon, text }, index) => (
								<li
									key={index}
									style={{
										display: "flex",
										alignItems: "center",
										marginBottom: "15px",
										fontSize: "1.1rem",
									}}
								>
									<Icon
										style={{
											marginRight: "15px",
											color: "#FFA500",
											fontSize: "1.5rem",
										}}
									/>
									{text}
								</li>
							))}
						</ul>
						<button
							onClick={handlePopupClose}
							style={{
								backgroundColor: "#ADF0D1",
								color: "#00203F",
								padding: "12px 25px",
								border: "none",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "1rem",
								fontWeight: "bold",
								transition: "transform 0.3s ease, background-color 0.3s ease",
							}}
							onMouseOver={(e) => {
								const target = e.target as HTMLButtonElement;
								target.style.transform = "scale(1.05)";
								target.style.backgroundColor = "#95D9C4";
							}}
							onMouseOut={(e) => {
								const target = e.target as HTMLButtonElement;
								target.style.transform = "scale(1)";
								target.style.backgroundColor = "#ADF0D1";
							}}
						>
							Get Started
						</button>
					</div>
				</div>
			)}

			{/* هذا هو الجزء الأساسي الذي سيظهر بعد إغلاق النافذة المنبثقة */}
			{!showPopup && (
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<section className="relative flex flex-col items-center justify-center px-6 py-16 md:flex-row md:space-x-12">
						{/* Text Content */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="text-center md:max-w-lg md:text-left"
						>
							<h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-[#00203F]">
								Learn SQL Like Never Before
							</h2>
							<h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
								Have you ever tried <br />
								<span className="font-semibold text-[#00BFA6]">
									AI-supported
								</span>
								learning?
							</h1>
							<p className="mt-4 text-lg text-gray-700 md:max-w-md">
								Master SQL with an AI-driven approach designed for interactive
								learning.
							</p>

							{/* Buttons */}
							<div className="mt-6 flex justify-center space-x-5 md:justify-start">
								<button
									className="rounded-lg bg-[#00203F] px-7 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#001d33]"
									onClick={() => router.push("/basic/dataType")}
								>
									Get Started
								</button>
								<Link
									href="#try"
									className="rounded-lg border border-[#00203F] px-7 py-3 text-sm font-bold text-[#00203F] shadow-lg transition-all hover:bg-[#00203F] hover:text-white"
								>
									Discover
								</Link>
							</div>
						</motion.div>

						{/* Image */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6 }}
							className="mt-10 w-full md:mt-0 md:w-1/2"
						>
							<Image
								src="/image/HomeImages/HomeComponent.jpg"
								alt="AI-supported SQL Learning"
								width={600}
								height={400}
								className="rounded-lg shadow-xl transition-shadow duration-300 hover:shadow-2xl"
							/>
						</motion.div>
					</section>

					<section className="section bg-gray-100 px-6 py-16" id="about">
						<div className="mx-auto grid max-w-screen-lg items-center gap-10 md:grid-cols-2">
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6 }}
								className="overflow-hidden rounded-lg border-[3px] border-solid border-[#00203F] shadow-lg"
							>
								<Image
									src="/image/HomeImages/AboutComponent.jpg"
									alt="About SQL Mentor"
									width={600}
									height={400}
									className="p-4"
								/>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.6 }}
							>
								<h2 className="mb-5 text-[1.5rem] font-bold leading-snug text-gray-900 sm:text-[1.875rem]">
									SQL Mentor is your gateway to mastering SQL. <br /> We offer
									interactive exercises, real-world insights. <br />
									Start your journey with us and turn data into{" "}
									<span className="font-bold text-[#00203F]">
										your superpower!
									</span>
								</h2>
							</motion.div>
						</div>
					</section>
				</motion.div>
			)}
		</div>
	);
}
