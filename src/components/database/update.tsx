"use client";
import { userDbApi } from "@/utils/apis";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

export default function UpdateData() {
	const [updateQuery, setUpdateQuery] = useState<string>("");
	const [popupVisible, setPopupVisible] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

	const validateAndUpdateData = async () => {
		try {
			const response = await fetch(userDbApi, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query: updateQuery,
				}),
			});
			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(
					`${errorData.error} \n ${errorData.originalError}` ||
						"Error executing query.",
				);
				return;
			}
			const data = await response.json();
			alert(data.message);
			setUpdateQuery("");
		} catch (error) {
			console.error("خطأ أثناء تحديث البيانات:", error);
			alert("حدث خطأ أثناء تحديث البيانات.");
		}
	};

	const handleIconClick = (event: React.MouseEvent) => {
		setPopupVisible(true);
	};

	const closePopup = () => {
		setPopupVisible(false);
	};

	return (
		<div className="mb-8 rounded-lg bg-[#00203F] p-6">
			<h2 className="mb-4 text-left text-2xl font-semibold text-[#ADF0D1]">
				Update Data
			</h2>
			<div className="relative">
				<input
					type="text"
					value={updateQuery}
					onChange={(e) => setUpdateQuery(e.target.value)}
					placeholder="UPDATE query"
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
			{errorMessage && (
				<div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
					<pre className="whitespace-pre-wrap text-red-500">{errorMessage}</pre>
				</div>
			)}
			<button
				onClick={validateAndUpdateData}
				className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
			>
				Update Data
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
      ref={popupRef}
      className="absolute rounded-md bg-white p-6 shadow-lg"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        minWidth: "250px",  // الحد الأدنى للعرض
        maxWidth: "90%",    // الحد الأقصى للعرض ليكون 90% من عرض الشاشة
        width: "auto",      // يسمح للنافذة بتغيير الحجم بشكل تلقائي
      }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-[#00203F]">
          How to use UPDATE
        </h3>
        <p className="mt-2 text-[#00203F]">
          To execute an UPDATE query, use the following syntax:
        </p>

        {/* النص داخل <pre> مع التمرير الأفقي */}
        <div className="mt-2 flex items-center justify-between rounded-md bg-[#f5f5f5] p-3 overflow-x-auto">
          <pre className="text-[#00203F] flex-1 whitespace-nowrap">
            UPDATE tableName SET column1 = value1, column2 = value2 WHERE condition;
          </pre>
          <button
            onClick={() =>
              copyToClipboard("UPDATE tableName SET column1 = value1, column2 = value2 WHERE condition;")
            }
            className="ml-4 rounded-full bg-[#ADF0D1] px-2 py-1 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
          </button>
        </div>

        <p className="mt-2 text-[#00203F]">
          Replace <code>tableName</code> with the name of your table, and
          set the column values you wish to update with{" "}
          <code>column1 = value1</code>, <code>column2 = value2</code>.
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
