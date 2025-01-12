import DataType from "@/components/pages/basic/dataType";
import { Metadata } from "next";
import { getAuthorizedPage } from "../../layout";
export const metadata: Metadata = {
	title: "SQLMentor - Data Type",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function dataTypePage() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<DataType getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
