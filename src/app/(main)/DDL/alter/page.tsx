/*
3
alter
*/

import Alter from "@/components/pages/DDL/alter";
import { getAuthorizedPage } from "../../layout";

export default function alter() {
	return <div className="p-4 text-base md:text-lg lg:text-xl">
		<Alter getAuthorizedPage={getAuthorizedPage}/>
	</div>;
}
