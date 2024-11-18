"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const UpdateData: React.FC = () => {
  const [updateQuery, setUpdateQuery] = useState<string>("");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

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
    const regex = /^UPDATE\s+(\S+)\s+SET\s+([\s\S]+)\s+WHERE\s+([\s\S]+)$/i;
    const match = updateQuery.trim().match(regex);

    if (!match) {
      alert("تعليمة UPDATE غير صحيحة.");
      return;
    }

    const tableName = match[1];
    const setPart = match[2].trim();
    const wherePart = match[3].trim();

    const setColumns = setPart.split(",").map((col) => {
      const [column, value] = col.split("=").map((part) => part.trim());
      return { column, value };
    });

    const whereConditions = wherePart.split("AND").map((condition) => condition.trim());

    if (!tableName || setColumns.length === 0 || whereConditions.length === 0) {
      alert("معلومات التحديث غير مكتملة.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE",
          tableName,
          setColumns,
          whereConditions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "خطأ أثناء تحديث البيانات.");
        return;
      }

      const data = await response.json();
      alert(data.message);
      setUpdateQuery(""); // مسح الحقل بعد النجاح
    } catch (error) {
      console.error("خطأ أثناء تحديث البيانات:", error);
      alert("حدث خطأ أثناء تحديث البيانات.");
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
    <div className="mb-8 bg-[#00203F] p-6 rounded-lg">
      <h2 className="mb-4 text-2xl font-semibold text-[#ADF0D1] text-left">Update Data</h2>
      <div className="relative">
        <input
          type="text"
          value={updateQuery}
          onChange={(e) => setUpdateQuery(e.target.value)}
          placeholder="UPDATE query"
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
        onClick={validateAndUpdateData}
        className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
      >
		
        Update Data
      </button>

      {popupVisible && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-25" style={{ zIndex: 9 }}></div>
          <div
            ref={popupRef}
            className="absolute p-6 bg-white shadow-lg rounded-md"
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
              <h3 className="text-xl font-semibold text-[#00203F]">How to use UPDATE</h3>
              <p className="text-[#00203F] mt-2">
                To execute an UPDATE query, use the following syntax:
              </p>
              <pre className="bg-[#f5f5f5] p-3 rounded-md mt-2">
                UPDATE tableName SET column1 = value1, column2 = value2 WHERE condition;
				<button
                  onClick={() => copyToClipboard("UPDATE tableName SET column1 = value1, column2 = value2 WHERE condition;")}
                  className="ml-4 py-1 px-2 bg-[#ADF0D1] text-[#00203F] rounded-full shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
                </button>
              </pre>
              <p className="text-[#00203F] mt-2">
                Replace <code>tableName</code> with the name of your table, and set the column values you wish to
                update with <code>column1 = value1</code>, <code>column2 = value2</code>.
              </p>
            </div>
            <button
              onClick={closePopup}
              className="w-full py-2 rounded-md bg-[#ADF0D1] text-[#00203F] hover:bg-[#00203F] hover:text-[#ADF0D1]"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateData;
