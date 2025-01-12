import Insert from "@/components/pages/DML/insert";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Insert Records",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};
export default function insert() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<Insert getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
