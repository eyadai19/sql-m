"use client";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const InsertData: React.FC = () => {
  const [insertQuery, setInsertQuery] = useState<string>("");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);

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

  const validateAndInsertData = async () => {
    const regex =
      /^INSERT\s+INTO\s+(\S+)(?:\s*\(([\s\S]+)\))?\s+VALUES\s*\(([\s\S]+)\)$/i;
    const match = insertQuery.trim().match(regex);

    if (!match) {
      alert("Invalid INSERT query.");
      return;
    }

    const tableName = match[1];
    const columnsPart = match[2]?.trim();
    const valuesPart = match[3]?.trim();

    const columns = columnsPart ? columnsPart.split(",").map((col) => col.trim()) : [];
    const values = valuesPart ? valuesPart.split(",").map((val) => val.trim()) : [];

    if (!tableName || columns.length === 0 || values.length === 0) {
      alert("Incomplete input data.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "INSERT", tableName, columns, values }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Error while inserting data.");
        return;
      }

      const data = await response.json();
      alert(data.message);
      setInsertQuery(""); // Clear input after success
    } catch (error) {
      console.error("Error while inserting data:", error);
      alert("An error occurred while inserting data.");
    }
  };

  const handleIconClick = () => {
    setPopupVisible(true); // Show popup when icon is clicked
  };

  const closePopup = () => {
    setPopupVisible(false); // Close popup
  };

  return (
    <div className="mb-8 bg-[#00203F] p-6 rounded-lg">
      <h2 className="mb-4 text-2xl font-semibold text-[#ADF0D1] text-left">Insert Data</h2>
      <div className="relative">
        <input
          type="text"
          value={insertQuery}
          onChange={(e) => setInsertQuery(e.target.value)}
          placeholder="INSERT query"
          className="mb-4 w-full rounded-md border p-3 shadow-sm bg-white text-[#00203F]"
        />
        <span
          className="absolute right-2 top-1/2 transform -translate-y-1/2 flex justify-center items-center w-8 h-8 rounded-full text-[#00203F] cursor-pointer"
          style={{ top: "calc(50% - 8px)" }}
          onClick={handleIconClick}
        >
           <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
        </span>
      </div>
      <button
        onClick={validateAndInsertData}
        className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
      >
        Insert Data
      </button>

      {popupVisible && (

			  <><div
				  className="fixed top-0 left-0 w-full h-full bg-black opacity-25"
				  style={{ zIndex: 9 }}
			  ></div><div
				  ref={popupRef} // ربط الـ popup مع الـ ref
				  className="absolute bg-white shadow-lg rounded-md"
				  style={{
					  position: "fixed",
					  top: "50%",
					  left: "50%",
					  transform: "translate(-50%, -50%)", // This ensures the popup is centered
					  zIndex: 10,
					  minWidth: "250px",
					  padding: "20px",
				  }}
			  >

					  <div className="mb-4">
						  <h3 className="text-xl font-semibold text-[#00203F]">How to use INSERT INTO</h3>
						  <p className="text-[#00203F] mt-2">
							  To insert data into a table, use the following syntax:
						  </p>
						  <pre className="bg-[#f5f5f5] p-3 rounded-md mt-2">
							  INSERT INTO tableName (column1, column2, ...) VALUES (value1, value2, ...);

							  <button
                               onClick={() => copyToClipboard("INSERT INTO tableName (column1, column2, ...) VALUES (value1, value2, ...);")}
                               className="ml-4 py-1 px-2 bg-[#ADF0D1] text-[#00203F] rounded-full shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
                               title="Copy to clipboard"
                             >
                               <FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
                             </button>

						  </pre>
						  <p className="text-[#00203F] mt-2">
							  Replace <code>tableName</code> with the name of the table, and list the <code>columns</code> and <code>values</code> accordingly.
						  </p>
					  </div>
					  <button
						  onClick={closePopup}
						  className="w-full py-2 rounded-md bg-[#ADF0D1] text-[#00203F] hover:bg-[#00203F] hover:text-[#ADF0D1]"
					  >
						  Close
					  </button>
				  </div></>
      )}
    </div>
  );
};

export default InsertData;
