"use client";
import { userDbApi } from "@/utils/apis";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

export default function InsertData() {
	const [insertQuery, setInsertQuery] = useState<string>("");
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

	const validateAndInsertData = async () => {
		try {
			const response = await fetch(userDbApi, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query: insertQuery }),
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
			setInsertQuery("");
		} catch (error) {
			console.error("Error while inserting data:", error);
			alert("An error occurred while inserting data.");
		}
	};

	const handleIconClick = () => {
		setPopupVisible(true);
	};

	const closePopup = () => {
		setPopupVisible(false);
	};

	return (
		<div className="mb-8 rounded-lg bg-[#00203F] p-6">
			<h2 className="mb-4 text-left text-2xl font-semibold text-[#ADF0D1]">
				Insert Data
			</h2>
			<div className="relative">
				<input
					type="text"
					value={insertQuery}
					onChange={(e) => setInsertQuery(e.target.value)}
					placeholder="INSERT query"
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
				onClick={validateAndInsertData}
				className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
			>
				Insert Data
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
      className="absolute rounded-md bg-white shadow-lg"
      style={{
        position: "fixed", // تحديد المكان بالنسبة للنافذة بالكامل
        top: "50%", // وضعها في منتصف الصفحة عموديًا
        left: "50%", // وضعها في منتصف الصفحة أفقيًا
        transform: "translate(-50%, -50%)", // الترجمة لضبط المركز بالضبط
        zIndex: 10,
        minWidth: "250px", // الحد الأدنى للعرض
        maxWidth: "90%", // الحد الأقصى للعرض على الأجهزة الصغيرة
        padding: "20px", // الحواف الداخلية
      }}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-[#00203F]">
          How to use INSERT INTO
        </h3>
        <p className="mt-2 text-[#00203F]">
          To insert data into a table, use the following syntax:
        </p>
        <div
          className="mt-2 flex items-center justify-between rounded-md bg-[#f5f5f5] p-3"
          style={{
            overflowX: "auto", // تمكين التمرير الأفقي
            wordWrap: "break-word", // لف الكلمات الطويلة
            whiteSpace: "nowrap", // منع التفاف النص داخل الـ <pre>
          }}
        >
          <pre className="flex-1">
            INSERT INTO tableName (column1, column2, ...) VALUES (value1, value2, ...);
          </pre>
          <button
            onClick={() =>
              copyToClipboard(
                "INSERT INTO tableName (column1, column2, ...) VALUES (value1, value2, ...);"
              )
            }
            className="ml-4 rounded-full bg-[#ADF0D1] px-2 py-1 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
          </button>
        </div>
        <p className="mt-2 text-[#00203F]">
          Replace <code>tableName</code> with the name of the table, and list the <code>columns</code> and <code>values</code> accordingly.
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
