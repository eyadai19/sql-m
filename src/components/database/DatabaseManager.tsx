"use client";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import AlterData from "./alter";
import CreateTable from "./create";
import DeleteData from "./delete";
import DropTable from "./Drop";
import InsertData from "./Insert";
import SelectData from "./Select";
import UpdateData from "./update";

export default function DatabaseManager() {
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
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-[#00203F] to-[#ADF0D1] py-8">
				<div className="w-2/3 rounded-lg border border-gray-200 bg-gray-300 p-6 shadow-md">
					{/* العنوان مع الأيقونة المنبثقة */}
					<div className="mb-6 flex items-center justify-between">
						<h1 className="text-3xl font-semibold text-[#00203F]">
							{" "}
							My DB Editor
						</h1>
						<FontAwesomeIcon
							icon={faInfoCircle}
							className="cursor-pointer text-[#00203f]"
							onClick={handleIconClick}
							title="Click for more info"
						/>
					</div>

					{/* نافذة منبثقة تشرح وظيفة الصفحة */}
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
								<h3 className="text-xl font-semibold text-[#00203F]"></h3>
								<p className="mt-2 p-3 text-[#00203F]">
									here you can manage your database such as:
									<br />
									- creating, updating,deleting tables
									<br />- selecting,inserting or deleting data.
								</p>
								<button
									onClick={closePopup}
									className="w-full rounded-md bg-[#ADF0D1] py-2 text-[#00203F] hover:bg-[#00203F] hover:text-[#ADF0D1]"
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
}
