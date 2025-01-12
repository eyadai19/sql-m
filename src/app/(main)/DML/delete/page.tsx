import Delete from "@/components/pages/DML/delete";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Delete Records",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};
export default function del() {
	return (
	<div className="p-4 text-base md:text-lg lg:text-xl">
		<Delete getAuthorizedPage={getAuthorizedPage}/>
	</div>);
}
