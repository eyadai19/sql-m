import FetchTables from "@/components/database/FetchTables";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import { logoutAction } from "../Profile/page";

import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - DataBase Exeplorer",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function DataBaseExeplorer() {
	return (
		<div className="">
			<ProfileNavbar logoutAction={logoutAction} />
			<FetchTables />
		</div>
	);
}
