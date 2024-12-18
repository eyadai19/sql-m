"use client";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

export default function DropTable() {
	const [dropQuery, setDropQuery] = useState<string>("");
	const [popupVisible, setPopupVisible] = useState<boolean>(false);
	const [popupPosition, setPopupPosition] = useState<{
		top: number;
		left: number;
	}>({ top: 0, left: 0 });

	// إنشاء ref للإشارة إلى الـ popup
	const popupRef = useRef<HTMLDivElement | null>(null);

	// دالة للتحقق مما إذا كان النقر حدث خارج الـ popup
	const handleClickOutside = (event: MouseEvent) => {
		if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
			setPopupVisible(false); // إغلاق الـ popup إذا تم النقر خارجها
		}
	};

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).catch((err) => {
			console.error("Failed to copy text: ", err);
		});
	};

	useEffect(() => {
		// إضافة مستمع الحدث عند عرض الـ popup
		if (popupVisible) {
			document.addEventListener("click", handleClickOutside);
		}

		// إزالة مستمع الحدث عند إخفاء الـ popup
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [popupVisible]);

	const validateAndDropTable = async () => {
		const regex = /^DROP\s+TABLE\s+(\S+)$/i;
		const match = dropQuery.trim().match(regex);

		if (!match) {
			alert("Invalid DROP query.");
			return;
		}

		const tableName = match[1];

		try {
			const response = await fetch("http://localhost:3000/api/db", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "DROP", tableName }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				alert(errorData.error || "Error while dropping the table.");
				return;
			}

			const data = await response.json();
			alert(data.message);
			setDropQuery(""); // Clear input after success
		} catch (error) {
			console.error("Error while dropping the table:", error);
			alert("An error occurred while dropping the table.");
		}
	};

	const handleIconClick = (event: React.MouseEvent) => {
		const { clientX, clientY } = event;

		// Set position for the popup where the user clicked
		setPopupPosition({
			top: clientY + 10, // Add some offset to avoid covering the click point
			left: clientX - 260, // Adjust the left position to be to the left of the button (assuming the width of the dialog is ~250px)
		});

		setPopupVisible(true); // Show the popup when the icon is clicked
	};

	const closePopup = () => {
		setPopupVisible(false); // Close the popup
	};

	return (
		<div className="mb-8 rounded-lg bg-[#00203F] p-6">
			<h2 className="mb-4 text-left text-2xl font-semibold text-[#ADF0D1]">
				Drop Table
			</h2>
			<div className="relative">
				<input
					type="text"
					value={dropQuery}
					onChange={(e) => setDropQuery(e.target.value)}
					placeholder="DROP query"
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
				onClick={validateAndDropTable}
				className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
			>
				Drop Table
			</button>

			{popupVisible && (
				<>
					{/* الخلفية المعتمة */}
					<div
						className="fixed left-0 top-0 h-full w-full bg-black opacity-25"
						style={{ zIndex: 9 }}
					></div>

					{/* النافذة المنبثقة */}
					<div
						ref={popupRef} // ربط الـ popup مع الـ ref
						className="absolute rounded-md bg-white p-6 shadow-lg"
						style={{
							position: "fixed", // تحديد المكان بالنسبة للنافذة بالكامل
							top: "50%", // وضعها في منتصف الصفحة عموديًا
							left: "50%", // وضعها في منتصف الصفحة أفقيًا
							transform: "translate(-50%, -50%)", // الترجمة لضبط المركز بالضبط
							zIndex: 10,
							minWidth: "250px",
						}}
					>
						<div className="mb-4">
							<h3 className="text-xl font-semibold text-[#00203F]">
								How to use DROP TABLE
							</h3>
							<p className="mt-2 text-[#00203F]">
								To drop a table from the database, use the following syntax:
							</p>
							<pre className="mt-2 rounded-md bg-[#f5f5f5] p-3">
								DROP TABLE tableName;
								<button
									onClick={() => copyToClipboard("DROP TABLE tableName;")}
									className="ml-4 rounded-full bg-[#ADF0D1] px-2 py-1 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
									title="Copy to clipboard"
								>
									<FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
								</button>
							</pre>
							<p className="mt-2 text-[#00203F]">
								Replace <code>tableName</code> with the name of the table you
								wish to delete. Be cautious, as this action is irreversible.
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
		</div>
	);
}
