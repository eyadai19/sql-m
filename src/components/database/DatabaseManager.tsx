"use client";
import React, { useState, useRef, useEffect } from "react";
import CreateTable from "./create";
import DropTable from "./Drop";
import InsertData from "./Insert";
import SelectData from "./Select";
import UpdateData from "./update";
import AlterData from "./alter";
import DeleteData from "./delete";
import FetchTables from "./FetchTables";
import { EditorNavbar } from "./EditorNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const DatabaseManager: React.FC = () => {
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
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

  const handleIconClick = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <>
      {/* شريط التنقل */}
      <EditorNavbar />

      <div className="bg-gradient-to-r from-[#00203F] to-[#ADF0D1] min-h-screen flex justify-center items-center py-8">
        <div className="bg-gray-300 w-2/3 shadow-md rounded-lg p-6 border border-gray-200">
          {/* العنوان مع الأيقونة المنبثقة */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-[#00203F]"> My DB Editor</h1>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-[#00203f] cursor-pointer"
              onClick={handleIconClick}
              title="Click for more info"
            />
          </div>

          {/* نافذة منبثقة تشرح وظيفة الصفحة */}
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
                <h3 className="text-xl font-semibold text-[#00203F]"></h3>
                <p className=" p-3 text-[#00203F] mt-2">
                  here you can manage your database such as:<br/>
				 -  creating, updating,deleting tables<br/>
				 -  selecting,inserting or deleting data.
                </p>
                <button
                  onClick={closePopup}
                  className="w-full py-2 rounded-md bg-[#ADF0D1] text-[#00203F] hover:bg-[#00203F] hover:text-[#ADF0D1]"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {/* المحتوى */}
          <CreateTable />
          <InsertData />
          <DeleteData />
          <UpdateData />
          <AlterData />
          <DropTable />
          <SelectData />
        </div>
      </div>
    </>
  );
};

export default DatabaseManager;
