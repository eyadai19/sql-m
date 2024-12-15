import DatabaseManager from "@/components/database/DatabaseManager";
import { logoutAction } from "../Profile/page";
import { ProfileNavbar } from "@/components/ProfileNavbar";

export default function UserComp() {
	return (
		<div>
			<ProfileNavbar	 logoutAction={logoutAction} />

			<DatabaseManager />
		</div>
	);
}
