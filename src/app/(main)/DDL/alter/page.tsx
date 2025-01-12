import Alter from "@/components/pages/DDL/alter";
import { Metadata } from "next";
import { getAuthorizedPage } from "../../layout";
export const metadata: Metadata = {
	title: "SQLMentor - Alter Table",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function alter() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<Alter getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
