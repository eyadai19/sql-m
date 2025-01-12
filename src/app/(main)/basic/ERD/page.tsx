import ERDPage from "@/components/pages/basic/ERD";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - ERD",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function ERD() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<ERDPage getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
