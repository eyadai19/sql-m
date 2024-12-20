"use client";
import { userDbApi } from "@/utils/apis";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

export default function SelectData() {
	const [selectQuery, setSelectQuery] = useState<string>("");
	const [selectResults, setSelectResults] = useState<Record<string, string>[]>(
		[],
	);
	const [popupVisible, setPopupVisible] = useState<boolean>(false);
	const [popupPosition, setPopupPosition] = useState<{
		top: number;
		left: number;
	}>({ top: 0, left: 0 });

	const popupRef = useRef<HTMLDivElement | null>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
			setPopupVisible(false);
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).catch((err) => {
			console.error("Failed to copy text: ", err);
		});
	};

	useEffect(() => {
		if (popupVisible) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [popupVisible]);

	const validateAndSelectData = async () => {
		const regex = /^SELECT\s+([\s\S]+)\s+FROM\s+(\S+)$/i;
		const match = selectQuery.trim().match(regex);

		if (!match) {
			alert("Invalid SELECT query.");
			return;
		}

		const columnsPart = match[1].trim();
		const tableName = match[2].trim();
		const columns = columnsPart.split(",").map((col) => col.trim());

		if (!tableName || columns.length === 0) {
			alert("Incomplete SELECT query.");
			return;
		}

		try {
			const response = await fetch(userDbApi, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "SELECT",
					tableName,
					selectColumns: columns,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "Error executing query.");
				return;
			}

			const data = await response.json();
			setSelectQuery("");
			setSelectResults(data.data);
		} catch (error) {
			console.error("Error executing query:", error);
			alert("An error occurred while executing the query.");
		}
	};

	const handleIconClick = (event: React.MouseEvent) => {
		const { clientX, clientY } = event;
		setPopupPosition({
			top: clientY + 10,
			left: clientX - 260,
		});
		setPopupVisible(true);
	};

	const closePopup = () => {
		setPopupVisible(false);
	};

	return (
		<div className="mb-8 rounded-lg bg-[#00203F] p-6">
			<h2 className="mb-4 text-left text-2xl font-semibold text-[#ADF0D1]">
				SELECT Query
			</h2>
			<div className="relative">
				<input
					type="text"
					value={selectQuery}
					onChange={(e) => setSelectQuery(e.target.value)}
					placeholder="SELECT query"
					className="mb-4 w-full rounded-md border bg-white p-3 text-[#00203F] shadow-sm"
				/>
				<span
					className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full text-[#00203F]"
					style={{ top: "calc(50% - 8px)" }}
					onClick={handleIconClick}
				>
					<FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
				</span>
			</div>
			<button
				onClick={validateAndSelectData}
				className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
			>
				Execute SELECT Query
			</button>

			{popupVisible && (
				<>
					<div
						className="fixed left-0 top-0 h-full w-full bg-black opacity-25"
						style={{ zIndex: 9 }}
					></div>
					<div
						ref={popupRef}
						className="absolute rounded-md bg-white p-6 shadow-lg"
						style={{
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							zIndex: 10,
							minWidth: "250px",
						}}
					>
						<div className="mb-4">
							<h3 className="text-xl font-semibold text-[#00203F]">
								How to use SELECT
							</h3>
							<p className="mt-2 text-[#00203F]">
								To execute a SELECT query, use the following syntax:
							</p>
							<pre className="mt-2 flex items-center justify-between rounded-md bg-[#f5f5f5] p-3">
								SELECT column1, column2 FROM tableName;
								<button
									onClick={() =>
										copyToClipboard("SELECT column1, column2 FROM tableName;")
									}
									className="ml-4 rounded-full bg-[#ADF0D1] px-2 py-1 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
									title="Copy to clipboard"
								>
									<FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
								</button>
							</pre>
							<p className="mt-2 text-[#00203F]">
								Replace <code>column1, column2</code> with the columns you want
								to select, and <code>tableName</code> with the name of the
								table.
							</p>
						</div>
						<button
							onClick={closePopup}
							className="w-full rounded-md bg-[#ADF0D1] py-2 text-[#00203F] hover:bg-[#00203F] hover:text-[#ADF0D1]"
						>
							Close
						</button>
					</div>
				</>
			)}

			{/* تحسين عرض الجدول */}
			{selectResults.length > 0 && (
				<div className="mt-6 rounded-lg bg-white p-6 shadow-md">
					<h3 className="mb-4 text-lg font-medium text-[#00203F]">
						Query Results:
					</h3>
					<table className="w-full table-auto border-collapse rounded-md border border-gray-300 text-[#00203F]">
						<thead className="bg-[#00203F] text-white">
							<tr>
								{Object.keys(selectResults[0]).map((key) => (
									<th
										key={key}
										className="border px-6 py-4 text-left text-sm uppercase tracking-wider text-white"
									>
										{key}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{selectResults.map((row, index) => (
								<tr key={index} className="odd:bg-[#f5f5f5] hover:bg-[#e0f7fa]">
									{Object.values(row).map((value, idx) => (
										<td
											key={idx}
											className="border px-6 py-4 text-sm text-[#00203F]"
										>
											{value}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
