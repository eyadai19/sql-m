import FetchTables from "@/components/database/FetchTables";
import { ProfileNavbar } from "@/components/layout/ProfileNavbar";
import { logoutAction } from "../Profile/page";

export default function DataBaseExeplorer() {
	return (
		<div className="">
			<ProfileNavbar logoutAction={logoutAction} />
			<FetchTables />
		</div>
	);
}
