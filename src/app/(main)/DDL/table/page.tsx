import CreateTable from "@/components/pages/DDL/tabel";
import { getAuthorizedPage } from "../../layout";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Create Table",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};
export default function tabel() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<CreateTable getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
