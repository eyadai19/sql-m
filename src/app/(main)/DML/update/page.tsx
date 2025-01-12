import Update from "@/components/pages/DML/update";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Update Records",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};
export default function update() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Update getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
