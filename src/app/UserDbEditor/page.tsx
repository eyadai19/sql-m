import DatabaseManager from "@/components/database/DatabaseManager";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import { logoutAction } from "../Profile/page";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "SQLMentor - Compiler",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function UserComp() {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />

			<DatabaseManager />
		</div>
	);
}
