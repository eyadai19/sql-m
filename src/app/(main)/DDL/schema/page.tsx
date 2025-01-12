import Schema from "@/components/pages/DDL/schema";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Schema Definition",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function schema() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Schema getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
