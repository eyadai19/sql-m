import DatabaseManager from "@/components/database/DatabaseManager";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import { logoutAction } from "../Profile/page";

export default function UserComp() {
	return (
		<div>
			<ProfileNavbar logoutAction={logoutAction} />

			<DatabaseManager />
		</div>
	);
}
