import Drop from "@/components/pages/DDL/drop";
import { Metadata } from "next";
import { getAuthorizedPage } from "../../layout";
export const metadata: Metadata = {
	title: "SQLMentor - Drop Table",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function drop() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<Drop getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
