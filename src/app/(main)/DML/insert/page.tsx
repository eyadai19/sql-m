/*
2
insert
*/

import Insert from "@/components/pages/DML/insert";
import { getAuthorizedPage } from "../../layout";

export default function insert() {
	return (
		<div className="p-4 text-base md:text-lg lg:text-xl">
			<Insert getAuthorizedPage={getAuthorizedPage} />
		</div>
	);
}
