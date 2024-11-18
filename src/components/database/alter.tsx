"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const AlterData: React.FC = () => {
  const [alterQuery, setAlterQuery] = useState<string>("");
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

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

  const validateAndAlterData = async () => {
    // تعبير regex لتحليل تعليمة ALTER
    const regex =
      /^ALTER\s+TABLE\s+(\S+)\s+(ADD|DROP)\s+COLUMN\s+(\S+)\s+(\S+)$/i;
    const match = alterQuery.trim().match(regex);

    if (!match) {
      alert("Invalid ALTER query.");
      return;
    }

    const tableName = match[1]; // اسم الجدول
    const action1 = match[2].toUpperCase(); // ADD أو DROP
    const columnName = match[3]; // اسم العمود
    const columnType = match[4]; // نوع العمود (فقط في حالة ADD)

    // تحقق من صحة الإدخال
    if (!tableName || !columnName || !action1) {
      alert("Incomplete ALTER query.");
      return;
    }

    // بناء JSON لإرسال البيانات إلى الخادم
    const requestData: { [key: string]: any } = {
      action: "ALTER",
      tableName,
      actionType: action1,
      columnName,
    };

    // إذا كان الإجراء هو ADD، نضيف نوع العمود
    if (action1 === "ADD" && columnType) {
      requestData.columnType = columnType;
    }

    // إرسال البيانات إلى الخادم
    try {
      const response = await fetch("http://localhost:3000/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      // معالجة الرد من الخادم
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Error while altering table structure.");
        return;
      }

      const data = await response.json();
      alert(data.message); // عرض رسالة النجاح
      setAlterQuery(""); // مسح الإدخال بعد النجاح
    } catch (error) {
      console.error("Error while altering table structure:", error);
      alert("An error occurred while altering the table structure.");
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
    <div className="mb-8 bg-[#00203F] p-6 rounded-lg">
      <h2 className="mb-4 text-2xl font-semibold text-[#ADF0D1] text-left">Alter Table Structure</h2>
      <div className="relative">
        <input
          type="text"
          value={alterQuery}
          onChange={(e) => setAlterQuery(e.target.value)}
          placeholder="ALTER query"
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
        onClick={validateAndAlterData}
        className="rounded-md bg-[#ADF0D1] px-4 py-2 text-[#00203F] shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
      >
        Alter Table Structure
      </button>

      {popupVisible && (
        <>
          {/* الخلفية المعتمة */}
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-25"
            style={{ zIndex: 9 }}
          ></div>

          {/* النافذة المنبثقة */}
          <div
            ref={popupRef} // ربط الـ popup مع الـ ref
            className="absolute p-6 bg-white shadow-lg rounded-md"
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
              <h3 className="text-xl font-semibold text-[#00203F]">How to use ALTER TABLE</h3>
              <p className="text-[#00203F] mt-2">
                To alter the structure of a table, use the following syntax:
              </p>
              <pre className="bg-[#f5f5f5] p-3 rounded-md mt-2">
                ALTER TABLE tableName ADD/DROP COLUMN columnName columnType;
                <button
                  onClick={() => copyToClipboard("ALTER TABLE tableName ADD/DROP COLUMN columnName columnType;")}
                  className="ml-4 py-1 px-2 bg-[#ADF0D1] text-[#00203F] rounded-full shadow hover:bg-[#00203F] hover:text-[#ADF0D1]"
                  title="Copy to clipboard"
                >
                  <FontAwesomeIcon icon={faCopy} className="text-[#00203F]" />
                </button>
              </pre>
              <p className="text-[#00203F] mt-2">
                Replace <code>tableName</code> with the name of the table, <code>columnName</code> with the column name, and <code>columnType</code> with the column type (only when adding a column).
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

export default AlterData;
