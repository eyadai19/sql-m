"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect } from "react";

const DeleteData: React.FC = () => {
  const [deleteQuery, setDeleteQuery] = useState<string>("");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setPopupVisible(false);
    }
  };

  useEffect(() => {
    if (popupVisible) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popupVisible]);

  const validateAndDeleteData = async () => {
    const regex = /^DELETE\s+FROM\s+(\S+)\s+WHERE\s+([\s\S]+)$/i;
    const match = deleteQuery.trim().match(regex);

    if (!match) {
      alert("Invalid DELETE query.");
      return;
    }

    const tableName = match[1];
    const whereConditions = match[2]
      .split("AND")
      .map((condition) => condition.trim());

    if (!tableName || whereConditions.length === 0) {
      alert("Query must include a table name and conditions.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", tableName, whereConditions }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Error while deleting data.");
        return;
      }

      const data = await response.json();
      alert(data.message);
      setDeleteQuery(""); // Clear input after success
    } catch (error) {
      console.error("Error while deleting data:", error);
      alert("An error occurred while deleting data.");
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <div className="mb-8 bg-[#00203F] p-6 rounded-lg">
      <h2 className="mb-4 text-2xl font-semibold text-[#ADF0D1] text-left">Delete Data</h2>
      <div className="relative">
        <input
          type="text"
          value={deleteQuery}
          onChange={(e) => setDeleteQuery(e.target.value)}
          placeholder="DELETE query"
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
        onClick={validateAndDeleteData}
        className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
      >
        Delete Data
      </button>

      {popupVisible && (
        <>
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-25"
            style={{ zIndex: 9 }}
          ></div>

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
              <h3 className="text-xl font-semibold text-[#00203F]">How to use DELETE</h3>
              <p className="text-[#00203F] mt-2">
                To delete data from a table, use the following syntax:
              </p>
              <div className="flex items-center bg-[#f5f5f5] p-3 rounded-md mt-2">
                <pre className="flex-1">DELETE FROM tableName WHERE condition;</pre>
                <button
                  onClick={() => copyToClipboard("DELETE FROM tableName WHERE condition;")}
                  className="ml-4 py-1 px-2 bg-[#ADF0D1] text-[#00203F] rounded-full shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
                </button>
              </div>
              <p className="text-[#00203F] mt-2">
                Replace <code>tableName</code> with the name of the table and 
                <code>condition</code> with the specific condition for the data you want to delete.
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

export default DeleteData;
