"use client";

import { useEffect, useRef, useState } from "react";
import AlterData from "./alter";
import CreateTable from "./create";
import DeleteData from "./delete";
import DropTable from "./Drop";
import InsertData from "./Insert";
import SelectData from "./Select";
import UpdateData from "./update";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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
			<div
				className="flex min-h-screen items-center justify-center px-4 sm:px-8"
				style={{
					background: "linear-gradient(to bottom, #00203F, #ADF0D1)",
				}}
			>
				<div className="w-full max-w-3xl rounded-lg border border-gray-200 bg-gray-300 p-4 shadow-md sm:p-6">
					{/* العنوان مع الأيقونة المنبثقة */}
					<div className="mb-4 flex items-center justify-between sm:mb-6">
						<h1 className="text-2xl font-semibold text-[#00203F] sm:text-3xl">
							My DB Editor
						</h1>
						<FontAwesomeIcon
							icon={faInfoCircle}
							className="cursor-pointer text-lg text-[#00203f] sm:text-xl"
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
								className="absolute rounded-md bg-white p-4 shadow-lg sm:p-6"
								style={{
									position: "fixed",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									zIndex: 10,
									minWidth: "90%",
									maxWidth: "400px",
								}}
							>
								<h3 className="text-lg font-semibold text-[#00203F] sm:text-xl">
									Information
								</h3>
								<p className="mt-2 text-sm text-[#00203F] sm:text-base">
									Here you can manage your database such as:
									<br />
									- creating, updating, deleting tables
									<br />- selecting, inserting, or deleting data.
								</p>
								<button
									onClick={closePopup}
									className="mt-4 w-full rounded-md bg-[#ADF0D1] py-2 text-[#00203F] hover:bg-[#00203F] hover:text-[#ADF0D1]"
								>
									Close
								</button>
							</div>
						</>
					)}

					{/* المحتوى */}
					<div className="grid grid-cols-1 gap-4 sm:gap-6">
						<CreateTable />
						<InsertData />
						<DeleteData />
						<UpdateData />
						<AlterData />
						<DropTable />
						<SelectData />
					</div>
				</div>
			</div>
		</>
	);
}
