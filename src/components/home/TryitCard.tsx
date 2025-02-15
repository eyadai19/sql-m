"use client";
import Link from "next/link";
import { useState } from "react";

export function TryitCard() {
	const [inputValue, setInputValue] = useState("");
	const [isCorrect, setIsCorrect] = useState(false);

	function handleChange(e: any) {
		const value = e.target.value;
		setInputValue(value);
		setIsCorrect(value.trim().toLowerCase() === "select");
	}

	const [userInput, setUserInput] = useState("");
	const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

	function handleInputChange(e: any) {
		const value = e.target.value;
		setUserInput(value);
		setIsAnswerCorrect(value.trim().toLowerCase() === "delete");
	}

	return (
		<section id="try">
			<div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-200 text-white md:flex-row">
				{/* First Activity Card */}
				<div className="max-w-lg transform rounded-2xl border border-gray-700 bg-[#012E57] p-8 shadow-xl transition hover:scale-105 hover:shadow-2xl">
					<h2 className="mb-4 text-center text-3xl font-bold text-[#ADF0D1]">
						Activity
					</h2>
					<div className="rounded-lg bg-gray-800 p-6">
						<h3 className="mb-2 text-xl font-semibold">Get Data</h3>
						<p className="mb-4">
							Insert the missing statement to get all columns from the{" "}
							<span className="text-[#ADF0D1]">Customers</span> table.
						</p>
						<div className="flex items-center rounded-md bg-gray-200 p-4 font-mono text-gray-900">
							<input
								type="text"
								value={inputValue}
								onChange={handleChange}
								placeholder="..."
								className={`rounded-md bg-white p-2 font-semibold text-black transition duration-300 focus:outline-none ${isCorrect ? "bg-green-300" : "bg-red-300"}`}
							/>
							<span className="ml-2">* FROM Customers;</span>
						</div>
						{isCorrect ? (
							<p className="mt-2 text-center font-semibold text-green-400">
								Correct!
							</p>
						) : (
							inputValue && (
								<p className="mt-2 text-center font-semibold text-red-400">
									Keep trying!
								</p>
							)
						)}
					</div>
					<Link
						href="/login"
						className="mt-4 block text-center text-[#ADF0D1] hover:underline"
					>
						Start your journey!
					</Link>
				</div>

				{/* Second Activity Card */}
				<div className="max-w-lg transform rounded-2xl border border-gray-700 bg-[#012E57] p-8 shadow-xl transition hover:scale-105 hover:shadow-2xl">
					<h2 className="mb-4 text-center text-3xl font-bold text-[#ADF0D1]">
						Activity
					</h2>
					<div className="rounded-lg bg-gray-800 p-6">
						<h3 className="mb-2 text-xl font-semibold">Delete Data</h3>
						<p className="mb-4">
							Insert the missing statement to delete all rows in the{" "}
							<span className="text-[#ADF0D1]">students</span> table, without
							deleting the table.
						</p>
						<div className="flex items-center rounded-md bg-gray-200 p-4 font-mono text-gray-900">
							<input
								type="text"
								value={userInput}
								onChange={handleInputChange}
								placeholder="..."
								className={`rounded-md bg-white p-2 font-semibold text-black transition duration-300 focus:outline-none ${isAnswerCorrect ? "bg-green-300" : "bg-red-300"}`}
							/>
							<span className="ml-2">FROM students;</span>
						</div>
						{isAnswerCorrect ? (
							<p className="mt-2 text-center font-semibold text-green-400">
								Correct!
							</p>
						) : (
							userInput && (
								<p className="mt-2 text-center font-semibold text-red-400">
									Keep trying!
								</p>
							)
						)}
					</div>
					<Link
						href="/login"
						className="mt-4 block text-center text-[#ADF0D1] hover:underline"
					>
						Start your journey!
					</Link>
				</div>
			</div>
		</section>
	);
}
