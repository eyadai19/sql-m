"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export function Card() {
	const router = useRouter();

	// State for SELECT
	const [inputValue, setInputValue] = useState("");
	const [isCorrect, setIsCorrect] = useState(false);

	function handleChange(e: { target: { value: any } }) {
		const value = e.target.value;
		setInputValue(value);

		if (value.trim().toLowerCase() === "select") {
			setIsCorrect(true);
		} else {
			setIsCorrect(false);
		}
	}

	// State for DELETE
	const [userInput, setUserInput] = useState("");
	const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

	function handleInputChange(event: { target: { value: any } }) {
		const inputValue = event.target.value;
		setUserInput(inputValue);

		if (inputValue.trim().toLowerCase() === "delete") {
			setIsAnswerCorrect(true);
		} else {
			setIsAnswerCorrect(false);
		}
	}

	// State for INSERT
	const [insertInput, setInsertInput] = useState("");
	const [isInsertCorrect, setIsInsertCorrect] = useState(false);

	function handleInsertChange(event: { target: { value: any } }) {
		const inputValue = event.target.value;
		setInsertInput(inputValue);

		if (inputValue.trim().toLowerCase() === "insert") {
			setIsInsertCorrect(true);
		} else {
			setIsInsertCorrect(false);
		}
	}

	// State for UPDATE
	const [updateInput, setUpdateInput] = useState("");
	const [isUpdateCorrect, setIsUpdateCorrect] = useState(false);

	function handleUpdateChange(event: { target: { value: any } }) {
		const inputValue = event.target.value;
		setUpdateInput(inputValue);

		if (inputValue.trim().toLowerCase() === "update") {
			setIsUpdateCorrect(true);
		} else {
			setIsUpdateCorrect(false);
		}
	}

	return (
		<>
			<div className="absolute right-4 top-4">
				<button
					onClick={() => router.back()}
					className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ADF0D1] text-[#00203F] shadow-md transition duration-300 hover:bg-[#00203F] hover:text-[#ADF0D1]"
					title="Go Back"
				>
					<FaArrowRight className="text-xl" />
				</button>
			</div>
			<div className="flex flex-col flex-wrap justify-evenly space-y-6 bg-[#00203F] p-6 md:flex-row md:space-y-6">
				{/* SELECT Challenge Card */}
				<div className="m-4 min-h-[250px] max-w-lg rounded-lg border border-gray-300 bg-[#19345E] p-6 text-white shadow-lg">
					<h2 className="mb-4 text-2xl font-bold">Challenge</h2>
					<div className="rounded-lg bg-[#1A1A1A] p-6">
						<h3 className="mb-2 text-xl font-semibold">Get Data</h3>
						<p className="mb-4">
							Insert the missing statement to get all the columns from the{" "}
							<span className="text-[#D4E8F2]">Customers</span> table.
						</p>
						<div className="rounded-md bg-gray-200 p-4 font-mono text-gray-900">
							<code>
								<input
									type="text"
									value={inputValue}
									onChange={handleChange}
									placeholder="..."
									className={`mr-1 rounded-md bg-white p-1 px-1 ${isCorrect ? "bg-green-200" : "bg-red-200"}`}
								/>
								* FROM Customers;
							</code>
						</div>
						{isCorrect ? (
							<p className="mt-2 font-semibold text-green-400">Correct!</p>
						) : (
							inputValue && (
								<p className="mt-2 font-semibold text-red-400">Keep trying!</p>
							)
						)}
					</div>
				</div>

				{/* DELETE Challenge Card */}
				<div className="m-8 min-h-[250px] max-w-lg rounded-lg border border-gray-300 bg-[#19345E] p-6 text-white shadow-lg">
					<h2 className="mb-4 text-2xl font-bold">Challenge</h2>
					<div className="rounded-lg bg-[#1A1A1A] p-6">
						<h3 className="mb-2 text-xl font-semibold">Delete Data</h3>
						<p className="mb-4">
							Insert the missing statement to delete all rows in the{" "}
							<span className="text-[#D4E8F2]">students</span> table, without
							deleting the table.
						</p>
						<div className="rounded-md bg-gray-200 p-4 font-mono text-gray-900">
							<code>
								<input
									type="text"
									value={userInput}
									onChange={handleInputChange}
									placeholder="..."
									className={`mr-1 rounded-md bg-white p-1 px-1 ${isAnswerCorrect ? "bg-green-200" : "bg-red-200"}`}
								/>
								FROM students;
							</code>
						</div>
						{isAnswerCorrect ? (
							<p className="mt-2 font-semibold text-green-400">Correct!</p>
						) : (
							userInput && (
								<p className="mt-2 font-semibold text-red-400">Keep trying!</p>
							)
						)}
					</div>
				</div>

				{/* INSERT Challenge Card */}
				<div className="m-4 min-h-[0px] max-w-lg rounded-lg border border-gray-300 bg-[#19345E] p-6 text-white shadow-lg">
					<h2 className="mb-4 text-2xl font-bold">Challenge</h2>
					<div className="rounded-lg bg-[#1A1A1A] p-6">
						<h3 className="mb-2 text-xl font-semibold">Insert Data</h3>
						<p className="mb-4">
							Insert the missing statement to add a new record to the{" "}
							<span className="text-[#D4E8F2]">employees</span> table.
						</p>
						<div className="rounded-md bg-gray-200 p-4 font-mono text-gray-900">
							<code>
								<input
									type="text"
									value={insertInput}
									onChange={handleInsertChange}
									placeholder="..."
									className={`mr-1 rounded-md bg-white p-1 px-1 ${isInsertCorrect ? "bg-green-200" : "bg-red-200"}`}
								/>
								INTO employees VALUES (2,ahmad,30000);
							</code>
						</div>
						{isInsertCorrect ? (
							<p className="mt-2 font-semibold text-green-400">Correct!</p>
						) : (
							insertInput && (
								<p className="mt-2 font-semibold text-red-400">Keep trying!</p>
							)
						)}
					</div>
				</div>

				{/* UPDATE Challenge Card */}
				<div className="m-4 min-h-[250px] max-w-lg rounded-lg border border-gray-300 bg-[#19345E] p-6 text-white shadow-lg">
					<h2 className="mb-4 text-2xl font-bold">Challenge</h2>
					<div className="rounded-lg bg-[#1A1A1A] p-6">
						<h3 className="mb-2 text-xl font-semibold">Update Data</h3>
						<p className="mb-4">
							Insert the missing statement to modify the salary of employees in
							the <span className="text-[#D4E8F2]">employees</span> table.
						</p>
						<div className="rounded-md bg-gray-200 p-4 font-mono text-gray-900">
							<code>
								<input
									type="text"
									value={updateInput}
									onChange={handleUpdateChange}
									placeholder="..."
									className={`mr-1 rounded-md bg-white p-1 px-1 ${isUpdateCorrect ? "bg-green-200" : "bg-red-200"}`}
								/>
								employees SET salary = 40000 WHERE id=2;
							</code>
						</div>
						{isUpdateCorrect ? (
							<p className="mt-2 font-semibold text-green-400">Correct!</p>
						) : (
							updateInput && (
								<p className="mt-2 font-semibold text-red-400">Keep trying!</p>
							)
						)}
					</div>
				</div>
			</div>
		</>
	);
}
